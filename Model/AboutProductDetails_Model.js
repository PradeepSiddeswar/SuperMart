const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  Item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  image: [String],
  quantity: Number,
  Description: String
});

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

module.exports = ProductDetails;