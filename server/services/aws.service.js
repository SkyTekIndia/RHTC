var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.SES_KEY,
    secretAccessKey: process.env.SES_SECRET
});

const sendMail = (Param) => {
    aws.config.update({ region: process.env.SES_REGION });
    const ses = new aws.SES({ apiVersion: '2010-12-01' });
    if (Param.to) {
        var ToAddress = Param.to;
        if (ToAddress.indexOf(',') > -1) {
            var Addresses = ToAddress.split(',');
        } else {
            var Addresses = [ToAddress];
        }
    }
    const sesParam = {
        Source: process.env.SITE_MAIL,
        Destination: { ToAddresses: Addresses },
        Message: {
            Subject: {
                Data: Param.subject
            },
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: Param.body,
                }
            }
        }
    }
    ses.sendEmail(sesParam).promise();
}

const getS3Client = () => {
    aws.config.update({ region: 'ap-south-1' });
    return new aws.S3({ apiVersion: '2006-03-01' });
}

const putObject = (key, fileStream) => {
    aws.config.update({ region: 'ap-south-1' });
    const s3 = new aws.S3({ apiVersion: '2006-03-01' });
    const s3Param = {
        Bucket: process.env.BUCKET,
        Key: key,
        Body: fileStream,
        ACL: 'public-read'
    }
    return s3.putObject(s3Param).promise();
}

const getObject = (key) => {
    aws.config.update({ region: 'ap-south-1' });
    const s3 = new aws.S3({ apiVersion: '2006-03-01' });
    const s3Param = {
        Bucket: process.env.BUCKET,
        Key: key
    }
    return s3.getObject(s3Param).promise();
}

const getSignedURL = (key) => {
    aws.config.update({ region: 'ap-south-1' });
    const s3 = new aws.S3({ apiVersion: '2006-03-01' });
    const s3Param = {
        Bucket: process.env.BUCKET,
        Key: key,
        Expires: 600
    };
    return s3.getSignedUrl('getObject', s3Param);
}

module.exports = {
    sendMail,
    putObject,
    getObject,
    getSignedURL,
    getS3Client
};