var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: { type: String, required: true, default: 'Admin' },
        email: { type: String, required: true },
        hash: { type: String, required: true },
        created: { type: Date, default: new Date().getTime() },
        updated: { type: Date, default: new Date().getTime() },
    }
);

//Export model
module.exports = mongoose.model('User', UserSchema);