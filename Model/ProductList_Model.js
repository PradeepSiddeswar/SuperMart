const mongoose = require('mongoose');

const productlistSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: ['150ml','250ml','300ml', '500ml','750ml', '1l', '2l'],
        required: true,
      },
    price: {
        type: Number,
        required: true,
    },
    quantity : {
        type: Number,
        required: true,
    },
    offer: {
        type: Number, 
        required: true,
    }
});

const ProductList = mongoose.model('ProductList', productlistSchema);

module.exports = ProductList