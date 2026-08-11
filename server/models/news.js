const mongoose = require('mongoose');
const paginate = require("mongoose-aggregate-paginate-v2");

var Schema = mongoose.Schema;

var NewsSchema = new Schema(
    {
        title: { type: String, required: true },
        associatedFile: { type: String, required: false }
    }
);

NewsSchema.set('timestamps', true);
NewsSchema.plugin(paginate);

//Export model
module.exports = mongoose.model('News', NewsSchema);