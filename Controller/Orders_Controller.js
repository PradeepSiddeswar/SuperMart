
const socketIo = require('socket.io');
const http = require('http'); // Require http module
const express = require('express');

const app = express();
const server = http.createServer(app); // Initialize the server

const io = socketIo(server); 

const Orders = require('../Model/Orders_Model'); 
// const io = require('../socket'); // Import your Socket.io instance

// Generate a unique order ID
function generateOrderID() {
  return `ORDER_${Date.now()}`;
}

  // Function to calculate distance between two sets of coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // The distance in kilometers
  return distance;
}

// Create Order API
exports.createOrder = (req, res) => {
  const orderID = generateOrderID();
  const { DropLocation, PickUpLocation, items, paymentResult } = req.body;
  const timestamp = new Date();

  // Calculate the total amount and total quantity from the items
  let totalAmount = 0;
  let totalQuantity = 0; // Initialize total quantity to 0

  for (const item of items) {
    totalAmount += item.price * item.quantity;
    totalQuantity += item.quantity; // Calculate the total quantity
  }

  const paymentStatus = paymentResult === 'success' ? 'Paid' : 'Failed';

  // Calculate distance using the obtained coordinates
  const orderLocation = DropLocation;
  const currentLocation = PickUpLocation;

  if (orderLocation && currentLocation) {
    const distance = calculateDistance(
      orderLocation.latitude,
      orderLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );

    const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

    // Create an order object
    const order = new Orders({
      orderID,
      DropLocation: orderLocation,
      PickUpLocation: currentLocation,
      timestamp,
      items,
      totalAmount,
      totalQuantity, // Include total quantity in the order
      paymentStatus,
      distance: formattedDistance,
    });

    order
      .save()
      .then(() => {
        // Emit the new location to all connected clients
        io.emit('locationUpdate', { orderID, DropLocation, PickUpLocation, timestamp });

        const response = {
          orderID,
          distance: formattedDistance,
          timestamp,
          DropLocation: orderLocation,
          PickUpLocation: currentLocation,
          items,
          totalAmount,
          totalQuantity, // Include total quantity in the response
          paymentStatus,
        };

        res.status(201).json(response);
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
      });
  } else {
    res.status(400).json({ error: 'Invalid location data' });
  }
};

// Get All Orders API
exports.getAll = async (req, res) => {
  try {
    const records = await Orders.find();

    const currentLocation = { latitude: 12.9352, longitude: 77.6245 };

    // Calculate and add the distance for each record
    const recordsWithDistance = records.map((record) => {
      const orderLocation = record.DropLocation;

      if (
        orderLocation &&
        orderLocation.latitude &&
        orderLocation.longitude &&
        currentLocation &&
        currentLocation.latitude &&
        currentLocation.longitude
      ) {
        // Calculate the distance using the same function and inputs
        const distance = calculateDistance(
          orderLocation.latitude,
          orderLocation.longitude,
          currentLocation.latitude,
          currentLocation.longitude
        );
        const formattedDistance =
          distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

        // Include the distance and PickUpLocation in the record
        return {
          ...record._doc, // If using Mongoose, use _doc to access the document properties
          distance: formattedDistance,
          PickUpLocation: record.PickUpLocation, // Include PickUpLocation
        };
      } else {
        // Handle invalid location data as needed
        return {
          ...record._doc,
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

  
  

  
  
  //get method
 
  
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

// //order_id
// exports.getOrderById = async (req, res) => {
//   try {
//     const orderId = req.params.orderId; // Extract the order ID from the URL parameters

//     const order = await Orders.findOne({ orderID: orderId });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ error: 'Error fetching order details', message: error.message });
//   }
// };


  

  
