var sha512 = require('js-sha512');

const getPayload = (data) => {

    const { _id, details, created, updated, status, payuMoneyId, bankRef, ...payload } = data;

    var hashData = { hashSequence: process.env.PAY_U_KEY + '|' + payload.txnid + '|' + payload.amount + '|' + payload.productinfo + '|' + payload.firstname + '|' + payload.email + '|||||||||||' + process.env.PAY_U_SALT };

    var hash = sha512(hashData.hashSequence);

    var payuData = {
        key: process.env.PAY_U_KEY,
        salt: process.env.PAY_U_SALT,
        service_provider: 'payu_paisa',
        hash: hash,
        surl: `${process.env.BASE_URL}/api/pay/success`,
        furl: `${process.env.BASE_URL}/api/pay/failure`
    };

    return Object.assign(payuData, payload);
}

module.exports = {
    getPayload
};