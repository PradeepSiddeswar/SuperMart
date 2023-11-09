const mongoose = require('mongoose');

const paymentMethodsEnum = ['Cash', 'Credit Card', 'UPI', 'Net Banking'];

// Define an enum for allowed payment statuses
const paymentStatusEnum = ['Paid', 'Pending', 'Canceled', 'Processing'];

const orderdetailsSchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  amount: Number,
  totalamount: Number,
  totalquantity: Number,
  paymentStatus: {
    type: String,
    enum: paymentStatusEnum, // Restrict the payment status to the allowed options
  },
  paymentmethod: {
    type: String,
    enum: paymentMethodsEnum, // Restrict the payment method to the allowed options
  },
  locationInfo: {
    pickup: String,
    drop: String,
  },
});

const OrderDetails = mongoose.model('OrderDetails', orderdetailsSchema);

module.exports = OrderDetails;
