const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  status: String,
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
  },
  image: String,
  quantity: Number
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
