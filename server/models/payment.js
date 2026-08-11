var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PaymentSchema = new Schema(
    {
        firstname: { type: String, required: true },
        email: { type: String, required: true },
        txnid: { type: String, required: true },
        status: { type: String, required: true },
        details: { type: JSON, required: true },
        amount: { type: Number, required: true },
        productinfo: { type: String, required: true, default: "Student Fee" },
        bankRef: { type: String },
        payuMoneyId: { type: String },
        created: { type: Date, default: new Date().getTime() },
        updated: { type: Date, default: new Date().getTime() },
    }
);

//Export model
module.exports = mongoose.model('Payment', PaymentSchema);