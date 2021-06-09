const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const connection = require('../libs/connection');
// const types = mongoose.Schema.Types;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: objectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: objectId,
    required: true,
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
