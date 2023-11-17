const mongoose = require('mongoose');

const CookingSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Cooking = mongoose.model('Cooking', CookingSchema);

module.exports = Cooking;