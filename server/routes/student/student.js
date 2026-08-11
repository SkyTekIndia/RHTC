const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
const path = require('path');
const fs = require("fs");
const temp = require('temp-dir');
const Student = require('./../../models/student');
const Payment = require('./../../models/payment');
const templateService = require('./../../services/emailtemplate.service');
const awsService = require('./../../services/aws.service');
const base64Img = require('base64-img');
const dateFormat = require('dateformat');

const labels = {
    totalDocs: 'totalCount',
    docs: 'list',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    hasPrevPage: 'hasPrev',
    hasNextPage: 'hasNext',
    pagingCounter: 'pageCounter'
};

const list = async (req, res) => {
    try {
        const { page, limit } = { ...req.query };
        const query = Student.aggregate().sort({ "rollno": 1 });
        const response = await Student.aggregatePaginate(query, { page: page, limit: limit, customLabels: labels });
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const { _id } = { ...req.params };
        const response = await Student.findOne({ _id: _id });
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const rejectById = async (req, res) => {
    try {
        const { id, rejectedReason } = { ...req.body };
        const student = await Student.findOne({ _id: id });
        let status = true;
        let msg = 'Application has been rejected!';
        if (student.rejected) {
            status = false;
            msg = 'Application has been accepted!';
        }
        await Student.findOneAndUpdate({ _id: id }, { rejected: status, rejectedReason: rejectedReason });
        res.status(200).json({ message: msg });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getAll = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json(students);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const generateRollNo = async (req, res) => {
    try {
        const students = await Student.find({ rejected: false }).sort({ "basicdetails.name": 1 });
        const year = 1000;//new Date().getFullYear().toString().substr(-2);
        const updateRoll = students.map((_student, i) => {
            const index = (++i);
            const rollno = year + index;
            return Student.findOneAndUpdate({ _id: _student._id }, { rollno: rollno });
        });
        await Promise.all(updateRoll);
        res.status(200).json({ message: "Roll number generated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const updatePaymentDetails = async (req, res) => {
    try {
        const paumentDetails = await Payment.find({ 'status': 'COMPLETED' });

        const updatePaymentArr = paumentDetails.map(async (record) => {
            const { txnid, payuMoneyId } = record;
            return Student.findOneAndUpdate({ 'basicdetails.aadhar': parseInt(record.details.basicdetails.aadhar) }, { transactionId: txnid, paymentId: payuMoneyId });
        });

        await Promise.all(updatePaymentArr);
        res.status(200).json({ message: "All payment details for all student updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getAdmitCard = async (req, res) => {
    try {
        const { aadhar = 0, dob } = { ...req.body };

        const studentDetails = await Student.findOne({ 'basicdetails.aadhar': parseInt(aadhar, 10), 'basicdetails.dob.day': dob.day, 'basicdetails.dob.month': dob.month, 'basicdetails.dob.year': dob.year });

        if (!studentDetails) {
            res.status(400).json({ message: "Incorrect combination of aadhar and date of birth" });
        }

        const { rollno, rejected, rejectedReason } =  studentDetails;

        if (rejected) {
            res.status(400).json({ message: rejectedReason });
        }

        if (!rollno) {
            res.status(400).json({ message: "Your admit card is not generated yet" });
        }

        let timeSlot = '9.16 AM to 9.30 AM';

        if(rollno >= "1001" && rollno <= "1250") {
            timeSlot = "8.30 AM to 8.45 AM";
        }else if(rollno >= "1251" && rollno <= "1500") {
            timeSlot = "8.46 AM to 9.00 AM";
        }else if(rollno >= "1501" && rollno <= "1750") {
            timeSlot = "9.01 AM to 9.15 AM";
        }else if(rollno >= "1751") {
            timeSlot = "9.16 AM to 9.30 AM";
        }

        const photoObject = await awsService.getObject(studentDetails.uploadphotosignature.photo);
        fs.writeFileSync(`${temp}/${studentDetails.uploadphotosignature.photo}`, photoObject.Body.toString(), { encoding: 'base64' });

        const PHOTOURL = base64Img.base64Sync(`${temp}/${studentDetails.uploadphotosignature.photo}`);

        const signObject = await awsService.getObject(studentDetails.uploadphotosignature.sign);
        fs.writeFileSync(`${temp}/${studentDetails.uploadphotosignature.sign}`, signObject.Body.toString(), { encoding: 'base64' });
        const SIGNURL = base64Img.base64Sync(`${temp}/${studentDetails.uploadphotosignature.sign}`);

        const admitCardParams = {
            STUDENTAPPLICATIONID: studentDetails.applicationId,
            ROLLNO: rollno,
            CANDIDATENAME: studentDetails.basicdetails.name,
            FATHERNAME: studentDetails.basicdetails.fatherName,
            MOTHERNAME: studentDetails.basicdetails.motherName,
            PHOTOURL: PHOTOURL,
            SIGNURL: SIGNURL,
            DOB: `${studentDetails.basicdetails.dob.day}/${studentDetails.basicdetails.dob.month}/${studentDetails.basicdetails.dob.year}`,
            CASTECATEGORY: studentDetails.basicdetails.category,
            TIMESLOT: timeSlot
        };

        await Student.findOneAndUpdate({ 'basicdetails.aadhar': parseInt(aadhar, 10) }, {
            $push: {
                downloadAttempt: {
                    date: dateFormat(new Date().getTime())
                }
            }
        });

        const admitCardHtml = await templateService.template('admit-card', admitCardParams);

        // we are using headless mode 
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH,
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        // We set the page content as the generated html by handlebars
        await page.setContent(admitCardHtml);

        // we Use pdf function to generate the pdf in the same folder as this file.
        await page.pdf({ path: `${studentDetails.applicationId}.pdf`, format: 'A4' });
        await browser.close();

        res.sendFile(path.resolve(`${studentDetails.applicationId}.pdf`));
    } catch (err) {
        console.log("Err", err);
        res.status(400).json({ message: "Oops, something went wrong" });
    }
}

const getApplicationForm = async (req, res) => {
    try {
        const { id, txnID } = { ...req.body };

        const filterCriteria = (txnID) ? { transactionId: txnID } : { _id: id };

        const studentDetails = await Student.findOne(filterCriteria);

        if (!studentDetails) {
            res.status(400).json({ message: "Oops, Invalid Request", filter: filterCriteria });
        }

        const { rollno, applicationId } = studentDetails;

        const photoObject = await awsService.getObject(studentDetails.uploadphotosignature.photo);
        fs.writeFileSync(`${temp}/${studentDetails.uploadphotosignature.photo}`, photoObject.Body.toString(), { encoding: 'base64' });

        const PHOTOURL = base64Img.base64Sync(`${temp}/${studentDetails.uploadphotosignature.photo}`);

        const signObject = await awsService.getObject(studentDetails.uploadphotosignature.sign);
        fs.writeFileSync(`${temp}/${studentDetails.uploadphotosignature.sign}`, signObject.Body.toString(), { encoding: 'base64' });
        const SIGNURL = base64Img.base64Sync(`${temp}/${studentDetails.uploadphotosignature.sign}`);

        const admitCardParams = {
            STUDENTAPPLICATIONID: applicationId,
            ROLLNO: rollno,
            CANDIDATENAME: studentDetails.basicdetails.name,
            FATHERNAME: studentDetails.basicdetails.fatherName,
            MOTHERNAME: studentDetails.basicdetails.motherName,
            PHOTOURL: PHOTOURL,
            SIGNURL: SIGNURL,
            DOB: `${studentDetails.basicdetails.dob.day}/${studentDetails.basicdetails.dob.month}/${studentDetails.basicdetails.dob.year}`,
            CASTECATEGORY: studentDetails.basicdetails.category,
            MOBILENO: studentDetails.basicdetails.category, 
            FEEPAID: (['UR', 'OBC'].includes(studentDetails.basicdetails.category)) ? '615' : '410',
            AADHARNUMBER: studentDetails.basicdetails.aadhar,
            MOBILENO: studentDetails.basicdetails.mobile,
            ADDRESS1: studentDetails.basicdetails.address1,
            ADDRESS2: studentDetails.basicdetails.address2,
            STATEDOMICILE: studentDetails.basicdetails.stateofDomicile,
            STUDENTPINCODE: studentDetails.basicdetails.pincode,
            EMAILADDRESS: studentDetails.basicdetails.email,
            TENTHPASSSTATUS: 'PASSED',
            TENTHBOARD: studentDetails.educationalqualifications.tenth.board,
            TENTHYEAR: studentDetails.educationalqualifications.tenth.passingYear,
            TENTHMARKSOBTAINED: studentDetails.educationalqualifications.tenth.marksObtained,
            TENTHMAXMARKS: studentDetails.educationalqualifications.tenth.maximumMarks,
            TENTHPERCENT: studentDetails.educationalqualifications.tenth.percentageMarks,
            TENTHSCHOOL: studentDetails.educationalqualifications.tenth.schoolNameAndLocation,
            TWELFTHPASSSTATUS: studentDetails.educationalqualifications.twelfth.status,
            TWELFTHBOARD: studentDetails.educationalqualifications.twelfth.board,
            TWELFTHYEAR: studentDetails.educationalqualifications.twelfth.passingYear,
            TWELFTHMARKSOBTAINED: studentDetails.educationalqualifications.twelfth.marksObtained,
            TWELFTHMAXMARKS: studentDetails.educationalqualifications.twelfth.maximumMarks,
            TWELFTHPERCENT: studentDetails.educationalqualifications.twelfth.percentageMarks,
            TWELFTHSCHOOL: studentDetails.educationalqualifications.twelfth.schoolNameAndLocation,
        };

        const applicationHtml = await templateService.template('application-form', admitCardParams);

        // we are using headless mode 
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.CHROME_PATH,
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();

        // We set the page content as the generated html by handlebars
        await page.setContent(applicationHtml);       

        // we Use pdf function to generate the pdf in the same folder as this file.
        await page.pdf({ path: `${id}.pdf`, format: 'A4' });
        await browser.close();

        res.sendFile(path.resolve(`${id}.pdf`));
    } catch (err) {
        console.log("error aashish", err)
        res.status(400).json({ message: "Oops, something went wrong", "error": err });
    }
}

// routes
router.get('/list', list);
router.post('/reject', rejectById);
router.get('/getAll', getAll);
router.get('/generate-rollno', generateRollNo);
router.get('/application/:_id', getById);
router.post('/getAdmitCard', getAdmitCard);
router.post('/getApplicationForm', getApplicationForm);
router.get('/update-paymentdetails', updatePaymentDetails);
module.exports = router;