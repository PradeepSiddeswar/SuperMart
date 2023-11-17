const mongoose = require('mongoose');

const BeautyproductsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  image: String,
  quantity: Number
});

const Beautyproducts = mongoose.model('Beautyproducts', BeautyproductsSchema);

module.exports = Beautyproducts;