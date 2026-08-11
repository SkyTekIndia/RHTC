const mongoose = require('mongoose');
const paginate = require("mongoose-aggregate-paginate-v2");

var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        rollno: { type: String, required: true, default: 'NA' },
        applicationId: { type: String, required: true },
        paymentId: { type: String, default: 'NA' },
        transactionId: { type: String, default: 'NA' },
        downloadAttempt: {
            type: [
                new Schema({
                    date: { type: String, required: false },
                })
            ], required: false, default: []
        },
        basicdetails: {
            name: { type: String, required: true },
            fatherName: { type: String, required: true },
            motherName: { type: String, required: true },
            dob: {
                year: { type: Number, required: true },
                month: { type: Number, required: true },
                day: { type: Number, required: true }
            },
            category: { type: String, required: true },
            age: { type: Number, required: true },
            aadhar: { type: Number, required: true },
            mobile: { type: Number, required: true },
            alternateMobile: { type: Number, required: false },
            identificationMarks: { type: String, required: false },
            stateofDomicile: { type: String, required: false },
            address1: { type: String, required: true },
            address2: { type: String, required: true },            
            pincode: { type: Number, required: true },
            email: { type: String, required: true }
        },
        educationalqualifications: {
            tenth: {
                board: { type: String, required: true },
                passingYear: { type: Number, required: true },
                marksObtained: { type: Number, required: true },
                maximumMarks: { type: Number, required: true },
                percentageMarks: { type: Number, required: true },
                schoolNameAndLocation: { type: String, required: true }
            },
            twelfth: {
                status: { type: String, required: true },
                board: { type: String, required: true },
                passingYear: { type: String, required: true },
                marksObtained: { type: String, required: true },
                maximumMarks: { type: String, required: true },
                percentageMarks: { type: String, required: true },
                schoolNameAndLocation: { type: String, required: true }
            }
        },
        uploadphotosignature: {
            photo: { type: String, required: true },
            sign: { type: String, required: true }
        },
        uploadotherdocuments: {
            aadharCertificate: { type: String, required: true },
            tenthCertificate: { type: String, required: true },
            twelfthCertificate: { type: String, required: true },
            casteCertificate: { type: String, required: false },
            characterCertificate: { type: String, require: true },
            twelfthAdCertificate: { type: String, require: false }
        },
        rejected: { type: Boolean, required: true, default: false },
        rejectedReason: { type: String, required: false },
        fee: { type: String, required: true },
        date: { type: String, required: true }
    }
);

StudentSchema.plugin(paginate);

//Export model
module.exports = mongoose.model('Student', StudentSchema);