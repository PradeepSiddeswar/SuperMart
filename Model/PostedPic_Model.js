const mongoose = require('mongoose');

const postedPicSchema = new mongoose.Schema({
  profilePic: String,
  name: String,
  timings: String,
  video: String
});

const PostedPic = mongoose.model('PostedPic', postedPicSchema);

module.exports = PostedPic;