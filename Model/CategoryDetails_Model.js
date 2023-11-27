const mongoose = require('mongoose');

// category  block1
const CategoryItemSchema = new mongoose.Schema({
  title: String,
  image: String,
});

// content block2
const ContentItemSchema = new mongoose.Schema({
  image: String,
  title: String,
});

// Subdocument schema block3
const Block3ItemSchema = new mongoose.Schema({
  name: String,
  images: String,
});

// Subdocument  block4
const Block4ItemSchema = new mongoose.Schema({
  image: String,
});

//  block5
const Block5ItemSchema = new mongoose.Schema({
  image: String,
  title: String,
});

// Main schema for block1
const Block1Schema = new mongoose.Schema({
  title: String,
  category: [CategoryItemSchema],
});

// Main schema for block2
const Block2Schema = new mongoose.Schema({
  title: String,
  content: [ContentItemSchema],
});

// Main schema for block3
const Block3Schema = new mongoose.Schema({
  title: String,
  content: [Block3ItemSchema],
});

// Main schema for block4
const Block4Schema = new mongoose.Schema({
  title: String,
  content: [Block4ItemSchema],
});

// Main schema for block5
const Block5Schema = new mongoose.Schema({
  title: String,
  content: [Block5ItemSchema],
});

// Schema for the overall structure
const CategoryDetailsSchema = new mongoose.Schema({
    block1: Block1Schema,
    block2: Block2Schema,
    block3: Block3Schema,
    block4: Block4Schema,
    block5: Block5Schema,
    // Add other blocks here if needed
});

// Create the mongoose model based on the schema
const CategoryDetails = mongoose.model('CategoryDetails', CategoryDetailsSchema);

module.exports = CategoryDetails;