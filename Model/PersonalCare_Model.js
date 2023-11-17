const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  image: String,
  quantity: Number
});

const Personalcare = mongoose.model('Personalcare', personalSchema);

module.exports = Personalcare;