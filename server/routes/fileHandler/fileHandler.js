const multer = require('multer');
const multerS3 = require('multer-s3');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");
const temp = require('temp-dir');
const awsService = require('./../../services/aws.service');

var upload = multer({
    storage: multerS3({
        s3: awsService.getS3Client(),
        bucket: process.env.BUCKET,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
});

module.exports = router;

const fileupload = async (req, res) => {
    res.send(req.file);
}

const base64_encode = (file) => {
    var bitmap = fs.readFileSync(file);
    return new Buffer.from(bitmap).toString('base64');
}

const getFile = async (req, res) => {
    try {
        const filename = req.body.filename;
        const s3Object = await awsService.getObject(filename).catch(e => { throw (e.message) });
        if (s3Object.Body) {
            fs.writeFile(`${temp}/${filename}`, s3Object.Body.toString(), { encoding: 'base64' }, function (err) {
                res.sendFile(path.resolve(`${temp}/${filename}`));
            });
        }
    } catch (err) {
        res.status(400).json({ message: "Oops, Something went wrong!!!" });
    }
}

const getSignedURL = async (req, res) => {
    try {
        const filename = req.body.filename;
        const s3Url = await awsService.getSignedURL(filename);
        res.status(200).json({ url: s3Url });
    } catch (err) {
        console.log("err", err);

        res.status(400).json({ message: "Oops, Something went wrong!!!" });
    }
}

// routes
router.post('/upload', upload.single("image"), fileupload);
router.post('/get', getFile);
router.post('/get-url', getSignedURL);