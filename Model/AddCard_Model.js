const mongoose = require('mongoose');

const addcardSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    ItemDetails: {
        type: String,
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

const AddCard = mongoose.model('AddCard', addcardSchema);

module.exports = AddCard