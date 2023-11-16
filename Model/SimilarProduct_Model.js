const mongoose = require('mongoose');

const similarPoductsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productId',
  },
  image: String,
  quantity: Number,
});

const SimilarProducts = mongoose.model('SimilarProducts', similarPoductsSchema);

module.exports = SimilarProducts;