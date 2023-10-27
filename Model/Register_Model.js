const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  phone: {
    type: String, // You can adjust the data type as needed (e.g., Number)
    required: true
  },
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number, // Assuming latitude is a number
    required: true
  },
  longitude: {
    type: Number, // Assuming longitude is a number
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleName: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  documentImage: {
    type: String,
    required: true
  },
  panImage: {
    type: String, // Store the image URL as a string
    required: true, // Example: You can make the image URL required
  },
  aadharImage: {
    type: String,
    required: true,
  },
  drivingLicenseImage: {
    type: String,
    required: true,
  }
  // Add more fields as needed to store metadata about the Aadhaar card
});

const RegisterModel = mongoose.model('Aadhaar', registerSchema);

module.exports = RegisterModel;
