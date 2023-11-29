
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  item_fullname: {
    type: String,
    required: true
  },
  mrp: String,
  mop: String,
  image_url: String
});

const DownListSchema = new mongoose.Schema({
    content: {
        HairCare: [ProductSchema],
        SkinCare: [ProductSchema],
        HygienicCare: [ProductSchema]
        // Add other categories as needed
      },
  name: {
    type: String,
    required: true
  },
  tab: [{
    type: {
      type: String,
      required: true
    }
  }],
  total_count: {
    type: Number,
    required: true
  },
 
});

module.exports = mongoose.model('DownList', DownListSchema);