const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema for your location data
const ordersAcceptSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
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
    type: Schema.Types.ObjectId,
    ref: 'RegisterModel' // Reference to the RegisterModel
  },
});

// Create a model based on the schema
const OrdersAccept = mongoose.model('OrderAccept', ordersAcceptSchema);

module.exports = OrdersAccept;