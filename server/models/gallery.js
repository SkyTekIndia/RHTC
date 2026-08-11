const mongoose = require('mongoose');
const paginate = require("mongoose-aggregate-paginate-v2");

var Schema = mongoose.Schema;

var GallerySchema = new Schema(
    {
        title: { type: String, required: true },
        associatedFile: { type: String, required: false },
        isHome: { type: Boolean, required: true, default: false }
    }
);

GallerySchema.set('timestamps', true);
GallerySchema.plugin(paginate);

//Export model
module.exports = mongoose.model('Gallery', GallerySchema);