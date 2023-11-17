const mongoose = require('mongoose');

const kitchenessntialsSchema = new mongoose.Schema({
  name: String,
  offer: Number,
  image: String,
});

const Kitchenessentials = mongoose.model('Kitchenessentials', kitchenessntialsSchema);

module.exports = Kitchenessentials;