// controllers/documentController.js
const  RegisterModel= require('../Model/Register_Model');
const NodeGeocoder = require('node-geocoder'); // Import the geocoding library

const mapboxApiKey = 'pk.eyJ1Ijoic2lkZGVzd2FyYSIsImEiOiJjbG51OWI4c2IwYjZwMmxuMWF6NDhlZHdjIn0.WH3M4bwTDpETOAV_85v4gg';

// Configure the geocoder with Mapbox as the provider
const geocoder = NodeGeocoder({
  provider: 'mapbox',
  apiKey: mapboxApiKey,
});

 // post method
exports.create = async (req, res) => {
  try {
    let {
      phone,
      name,
      location, // Use 'location' field to specify the address or place name
      vehicleType,
      vehicleName,
      vehicleNumber,
      documentImage,
      panImage,
      aadharImage,
      drivingLicenseImage,
    } = req.body;

    // Validate required fields
    if (!documentImage || !panImage || !aadharImage || !drivingLicenseImage) {
      return res.status(400).json({ error: 'panImage, aadharImage, and drivingLicenseImage are required fields' });
    }

    // Handle file uploads (as in your provided code)
    if (req.files) {
      documentImage = req.files['documentImage'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['documentImage'][0].filename
        : '';
      panImage = req.files['panImage'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['panImage'][0].filename
        : '';
      aadharImage = req.files['aadharImage'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['aadharImage'][0].filename
        : '';
      drivingLicenseImage = req.files['drivingLicenseImage'][0]
        ? req.protocol + '://' + req.get('host') + '/uploads/' + req.files['drivingLicenseImage'][0].filename
        : '';
    }

    // Use the geocoder to obtain latitude and longitude from the provided location
    const geocodeResult = await geocoder.geocode(location);

    if (!geocodeResult || geocodeResult.length === 0) {
      return res.status(400).json({ error: 'Location not found or invalid' });
    }

    const latitude = geocodeResult[0].latitude;
    const longitude = geocodeResult[0].longitude;

    // Create a new category with the obtained latitude and longitude
    const register = new RegisterModel({
      phone,
      name,
      latitude,
      longitude,
      vehicleType,
      vehicleName,
      vehicleNumber,
      documentImage,
      panImage,
      aadharImage,
      drivingLicenseImage,
    });

    // Save the category to your database
    await register.save();

    // Construct the response data
    const responseData = {
      message: 'Documents uploaded successfully',
      data: {
      _id: register._id,
      phone: register.phone,
      name: register.name,
      latitude: register.latitude,
      longitude: register.longitude,
      vehicleType: register.vehicleType,
      vehicleName: register.vehicleName,
      vehicleNumber: register.vehicleNumber,
      documentImage: register.documentImage,
      panImage: register.panImage,
      aadharImage: register.aadharImage,
      drivingLicenseImage: register.drivingLicenseImage,
      },
    };

    // Respond with success status and the response data
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Error creating category', message: error.message });
  }
};

//get method
exports.getAll = async (req, res) => {
  try {
    const records = await RegisterModel.find();
    const responseData = {
      message: 'All documents upload successfully',
      data: records,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error fetching records', message: error.message });
  }
};
 
// delete method
exports.delete = (req, res) => {
  const id = req.params.id
  RegisterModel.findByIdAndDelete(id)
      .then(data => {
          if (!data) {
              res.status(400).send(`category not found with ${id}`)
          } else {
              res.send("category deleted successfully")
          }
      })
      .catch(error => {
          res.status(500).send(error)
      })
}