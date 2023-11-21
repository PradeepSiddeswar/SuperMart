const mongoose = require('mongoose');

const actionDetailsSchema = new mongoose.Schema({
  Action: String,
  RegisterModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisterModel', // Correct reference to the RegisterModel
  },
});

const ActionDetails = mongoose.model('ActionDetails', actionDetailsSchema);

module.exports = ActionDetails;

