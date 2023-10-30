

const socketIo = require('socket.io');
const http = require('http'); // Require http module
const express = require('express');

const app = express();
const server = http.createServer(app); // Initialize the server

const io = socketIo(server); 

const Orders = require('../Model/Orders_Model'); // Import the Location model
// const io = require('../socket'); // Import your Socket.io instance

// Generate a unique order ID
function generateOrderID() {
  return `ORDER_${Date.now()}`;
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = earthRadius * c; // The distance in kilometers
    return distance;
  }


  exports.createOrder = (req, res) => {
    const orderID = generateOrderID();
    const { DropLocation, items, paymentResult } = req.body;
    const timestamp = new Date();
  
    // Calculate the total amount from the items
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }
  
    const paymentStatus = paymentResult === 'success' ? 'Paid' : 'Failed';
  
    const order = new Orders({
      orderID,
      DropLocation,
      timestamp,
      items,
      totalAmount,
      paymentStatus,
    });
  
    order.save()
      .then(() => {
        // Emit the new location to all connected clients
        io.emit('locationUpdate', { orderID, DropLocation, timestamp });
  
        const orderLocation = DropLocation; // Use the order's location (DropLocation)
        const currentLocation = { latitude: 12.9352, longitude: 77.6245 }; // Replace with the actual current location
      
        const distance = calculateDistance(orderLocation.latitude, orderLocation.longitude, currentLocation.latitude, currentLocation.longitude);
        const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;
  
        const response = {
          orderID,
          distance: formattedDistance,
          timestamp,
          DropLocation,
          items,
          totalAmount,
          paymentStatus,
        };
  
        res.status(201).json(response);
      })
      .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
      });
  };


  
  
  //get method
exports.getAll = async (req, res) => {
  try {
    const records = await Orders.find();

    // Assuming you have the current location coordinates
    const currentLocation = { latitude: 12.9352, longitude: 77.6245 }; // Replace with the actual current location

    // Calculate and add the distance for each record
    const recordsWithDistance = records.map(record => {
      const orderLocation = record.DropLocation; // Replace with the appropriate field in your schema

      // Check if the location data is valid
      if (
        orderLocation && orderLocation.latitude && orderLocation.longitude &&
        currentLocation && currentLocation.latitude && currentLocation.longitude
      ) {
        const distance = calculateDistance(
          orderLocation.latitude, orderLocation.longitude,
          currentLocation.latitude, currentLocation.longitude
        );
        const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

        // Add the distance to the record
        return {
          ...record._doc, // If using Mongoose, use _doc to access the document properties
          distance: formattedDistance,
        };
      } else {
        return {
          ...record._doc,
          distance: 'Invalid location data',
        };
      }
    });

    const responseData = {
      message: 'All orders retrieved successfully',
      data: recordsWithDistance,
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
  Orders.findByIdAndDelete(id)
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
  
  

  
