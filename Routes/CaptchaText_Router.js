const mongoose = require('mongoose');

const captchatextSchema = new mongoose.Schema({
  captchaText: {
    type: String,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

const CaptchaText = mongoose.model('CaptchaText', captchatextSchema);

module.exports = CaptchaText;