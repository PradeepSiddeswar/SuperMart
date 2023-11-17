const mongoose = require('mongoose');

const singlebannerSchema = new mongoose.Schema({
  image: String,

});

const SingleBanner = mongoose.model('SingleBanner', singlebannerSchema);

module.exports = SingleBanner;