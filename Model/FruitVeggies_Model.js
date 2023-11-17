const mongoose = require('mongoose');

const FruitSchema = new mongoose.Schema({
  name: String,
  offer: Number,
  image: String,
});

const Fruit = mongoose.model('Fruit', FruitSchema);

module.exports = Fruit;