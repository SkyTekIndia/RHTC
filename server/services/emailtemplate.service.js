var fs = require('fs');
const template = async (type, data) => {
    switch (type) {
        case 'payment':
           return readHtml('./server/templates/payment.html', data);
        case 'admit-card':
            return readHtml('./server/templates/admit-card.html', data);
        case 'application-form':
            return readHtml('./server/templates/application-form.html', data);
        default:
           return readHtml('./server/templates/payment-received.html', data);
    }
}

const readHtml = (path, replaceObj) => {
    let data = fs.readFileSync(path, 'utf8');

    var re = new RegExp(Object.keys(replaceObj).join("|"), "gi");
    data = data.replace(re, function (matched) {
        return replaceObj[matched];
    });
    return data;
}

module.exports = {
    template
};