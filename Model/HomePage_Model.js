const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  image: String,

});

const HomePage = mongoose.model('HomePage', homepageSchema);

module.exports = HomePage;