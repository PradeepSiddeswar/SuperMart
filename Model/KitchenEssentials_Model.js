const mongoose = require('mongoose');

const kitchenessntialsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offer: Number,
  size: String,
  image: String,
  quantity: Number

});

const Kitchenessentials = mongoose.model('Kitchenessentials', kitchenessntialsSchema);

module.exports = Kitchenessentials;