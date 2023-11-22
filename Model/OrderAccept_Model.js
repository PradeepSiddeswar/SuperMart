const mongoose = require('mongoose');

// Define a schema for your location data
const ordersAcceptSchema = new mongoose.Schema({
  orderID: String,
 DropLocation : {
  latitude : Number,
  longitude : Number,
 },
 PickUpLocation: {
  latitude : Number,
  longitude: Number,
 },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Failed'], // Payment status can be 'Paid' or 'Failed'
    required: true,
  },
  registerModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisterModel', // Reference to the RegisterModel
  },
});

// Create a model based on the schema
const OrdersAccept = mongoose.model('OrderAccept', ordersAcceptSchema);

module.exports = OrdersAccept;