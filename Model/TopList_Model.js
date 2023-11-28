// models/FashionCategory.js

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

const TopListSchema = new mongoose.Schema({
    content: {
        Womens: [ProductSchema],
        Men: [ProductSchema],
        Kids: [ProductSchema]
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

module.exports = mongoose.model('TopList', TopListSchema);

