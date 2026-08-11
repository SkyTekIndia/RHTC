const express = require("express");
const request = require("request");
const router = express.Router();
const paymentService = require("./../../services/payment.service");
const templateService = require("./../../services/emailtemplate.service");
const awsService = require("./../../services/aws.service");
const Payment = require("./../../models/payment");
const Student = require("./../../models/student");
const dateFormat = require("dateformat");

const pay = async (req, res) => {
  try {
    let amountToPay = 410;
    const { basicdetails } = req.body;
    const { category } = basicdetails;

    if (["UR", "OBC"].includes(category)) {
      amountToPay = 615;
    }

    const payment = new Payment({
      txnid: `RHTC-${new Date().getTime()}`,
      firstname: basicdetails.name,
      email: basicdetails.email,
      status: "INITIATED",
      details: req.body,
      amount: amountToPay,
    });

    const payload = paymentService.getPayload(payment.toJSON());

    const alreadyExists = await Student.findOne({
      "basicdetails.aadhar": basicdetails.aadhar,
    });

    if (alreadyExists) {
      throw "You are aleady registered";
    }

    // payment initiated
    await payment.save();

    request.post(
      process.env.PAY_U_URL,
      { form: payload, headers: this.headers },
      function (err, response) {
        if (response) {
          var result = response.headers.location;
          res.send({ url: result });
        } else {
          throw err.message;
        }
      }
    );
  } catch (err) {
    res
      .status(400)
      .json({ message: "Oops, It seems like you are already registered" });
  }
};

const success = async (req, res) => {
  try {
    const applicationId = `${new Date().getTime()}`;
    const gatewayResponse = {
      status: "COMPLETED",
      bankRef: req.body.bank_ref_num,
      payuMoneyId: req.body.payuMoneyId,
      amount: req.body.amount,
    };

    const transaction = await Payment.findOneAndUpdate(
      { txnid: req.body.txnid },
      gatewayResponse
    );
    const responseString = JSON.stringify(gatewayResponse);
    const resBase64 = Buffer.from(responseString).toString("base64");

    const paymentDetails = {
      APPLICATIONID: applicationId,
      TRANSACTIONID: req.body.txnid,
      GATEWAYID: req.body.payuMoneyId,
      TOTALAMOUNT: req.body.amount,
      CANDIDATENAME: req.body.firstname,
      FATHERNAME: transaction.details.basicdetails.fatherName,
      DATEANDTIME: dateFormat(transaction.created),
    };

    const emailBody = await Promise.all([
      templateService.template("payment", paymentDetails),
      templateService.template("payment-received", paymentDetails),
    ]).catch((err) => {
      throw err;
    });

    const sendStudentMailParam = {
      to: transaction.details.basicdetails.email,
      subject: "Congratulations Registration Successfull!!!",
      body: emailBody[0],
    };

    const sendAdminMailParam = {
      to: process.env.ADMIN_MAIL,
      subject: "A New Payment Received",
      body: emailBody[1],
    };

    // set applicationId
    transaction.details.applicationId = applicationId;
    transaction.details.transactionId = req.body.txnid;
    transaction.details.paymentId = req.body.payuMoneyId;
    transaction.details.fee = req.body.amount;
    transaction.details.date = dateFormat(transaction.created);
    const student = new Student(transaction.details);

    await Promise.all([
      awsService.sendMail(sendStudentMailParam),
      awsService.sendMail(sendAdminMailParam),
      student.save(),
    ]).catch((err) => {
      throw err;
    });

    res.redirect(`/pay-success?txnid=${req.body.txnid}&response=${resBase64}`);
  } catch (err) {
    console.log("Error", err);
    res.redirect(`/pay-failure?txnid=${req.body.txnid}`);
  }
};

const failure = async (req, res) => {
  try {
    const gatewayResponse = {
      status: "CANCELLED",
      bankRef: req.body.bank_ref_num,
      payuMoneyId: req.body.payuMoneyId,
      amount: req.body.amount,
    };
    await Payment.findOneAndUpdate(
      { txnid: req.body.txnid },
      gatewayResponse
    ).catch((err) => {
      throw err;
    });
    await Payment.findOne({ txnid: req.body.txnid }).catch((err) => {
      throw err;
    });
    const responseString = JSON.stringify(gatewayResponse);
    const resBase64 = Buffer.from(responseString).toString("base64");
    res.redirect(`/pay-success?txnid=${req.body.txnid}&response=${resBase64}`);
  } catch (err) {
    console.log("Error::", err);
    res.redirect(`/pay-failure?txnid=${req.body.txnid}`);
  }
};

const recover = async (req, res) => {
  try {
    
    const paymentDetails = await Payment.find( { status: "COMPLETED" } );

    await Promise.all(
      paymentDetails.map(async transaction => {
        const applicationId = `${new Date().getTime()}`;

        transaction.details.applicationId = applicationId;
        transaction.details.transactionId = transaction.txnid;
        transaction.details.paymentId = transaction.payuMoneyId;
        transaction.details.fee = transaction.amount;
        transaction.details.date = dateFormat(transaction.created);
        
        const student = new Student(transaction.details);
    
        await student.save();
      })
    );

    res.send({ message: 'Successfully recovered' });
  } catch (err) {
    console.log("Error", err);
    res
      .status(400)
      .json({ message: err.message });
  }
};

// routes
router.post("/", pay);
router.post("/success", success);
router.post("/failure", failure);
router.post("/recover", recover);

module.exports = router;
