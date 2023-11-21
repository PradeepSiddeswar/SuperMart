const  RegisterModel= require('../Model/Register_Model');
const Order = require('../Model/Orders_Model')
const socketIo = require('socket.io');
const http = require('http'); // Require http module
const express = require('express');

const app = express();
const server = http.createServer(app); // Initialize the server

const io = socketIo(server); 

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

    // Create a new category with the obtained latitude and longitude
    const register = new RegisterModel({
      phone,
      name,
      location,
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
      location: register.location,
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

// handle action Method

exports.handleAction = async (req, res) => {
  const orderID = generateOrderID();

  const { _id, action, DropLocation, PickUpLocation, items, paymentResult } = req.body;

  try {
    let response;

    if (action === 'accept' || action === 'reject') {
      let orderResponse = {};
      // Your logic to create order
      // Calculate the total amount and total quantity from the items
      let totalAmount = 0;
      let totalQuantity = 0;

      for (const item of items) {
        totalAmount += item.price * item.quantity;
        totalQuantity += item.quantity;
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

        const order = new Order({
          orderID,
          DropLocation: orderLocation,
          PickUpLocation: currentLocation,
          timestamp: new Date(), // Assuming the timestamp needs to be the current time
          items,
          totalAmount,
          totalQuantity, // Include total quantity in the order
          paymentStatus,
          distance: formattedDistance,
        });

        // Save the order to the database
        await order.save();

        // Emit the new location to all connected clients (if you're using socket.io)
        io.emit('locationUpdate', { orderID, DropLocation, PickUpLocation, timestamp: new Date() });

        // Create an order object for the response
        orderResponse = {
          orderID,
          DropLocation: orderLocation,
          PickUpLocation: currentLocation,
          timestamp: new Date(),
          items,
          totalAmount,
          totalQuantity,
          paymentStatus,
          distance: formattedDistance,
        };
      }

      // Handle the action (accept or reject)
      if (action === 'accept') {
        // Fetch details based on the provided ID from the RegisterModel
        const registerItem = await RegisterModel.findById(_id);

        if (!registerItem) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // Construct the response containing _id, action, and name for "accept"
        response = {
          _id,
          name: registerItem.name,
          action: 'Order Accepted',
          message: 'Order has been Accepted Successfully.',
          order: orderResponse,
        };
      } else {
        // Construct the response for "reject"
        response = {
          _id,
          action: 'Order Rejected',
          message: 'Order has been rejected.',
          order: orderResponse,
        };
      }
    } else {
      return res.status(400).json({ error: 'Invalid action specified.' });
    }

    res.json(response);
  } catch (error) {
    console.error('Error handling action and order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().populate('registerModel').lean();

    if (!allOrders || allOrders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    const transformedOrders = [];

    for (const order of allOrders) {
      console.log(`Searching for data in RegisterModel for order ID: ${order.registerModel}`);

      let additionalInfo = null;
      try {
        additionalInfo = await RegisterModel.findById(order.registerModel); // Fetch additional info based on order ID
      } catch (error) {
        console.error('Error fetching additional info from RegisterModel:', error);
      }

      if (additionalInfo) {
        console.log(`Found data in RegisterModel for order ID: ${order.registerModel}`);
      } else {
        console.log(`No data found in RegisterModel for order ID: ${order.registerModel}`);
      }

      const distance = calculateDistance(
        order.DropLocation.latitude,
        order.DropLocation.longitude,
        order.PickUpLocation.latitude,
        order.PickUpLocation.longitude
      );

      const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

      const orderResponse = {
        orderID: order.orderID,
        DropLocation: order.DropLocation,
        PickUpLocation: order.PickUpLocation,
        timestamp: order.timestamp,
        items: order.items,
        totalAmount: order.totalAmount,
        totalQuantity: order.totalQuantity,
        paymentStatus: order.paymentStatus,
        distance: formattedDistance,
      };

      const transformedOrder = {
        _id: order._id,
        name: additionalInfo && additionalInfo.name ? additionalInfo.name : 'N/A',
        action: additionalInfo && additionalInfo.action ? additionalInfo.action : 'N/A',
        message: additionalInfo && additionalInfo.message ? additionalInfo.message : 'N/A',
        order: orderResponse,
      };
      
      transformedOrders.push(transformedOrder);
    }

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateOrder = async (req, res) => {
  const { _id, DropLocation, PickUpLocation, items, paymentResult } = req.body;

  try {
    const existingOrder = await Order.findById(_id);

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Your logic to update order details
    // Calculate the total amount and total quantity from the items
    let totalAmount = 0;
    let totalQuantity = 0;

    for (const item of items) {
      totalAmount += item.price * item.quantity;
      totalQuantity += item.quantity;
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

      // Update the existing order details
      existingOrder.DropLocation = orderLocation;
      existingOrder.PickUpLocation = currentLocation;
      existingOrder.timestamp = new Date(); // Update timestamp if needed
      existingOrder.items = items;
      existingOrder.totalAmount = totalAmount;
      existingOrder.totalQuantity = totalQuantity;
      existingOrder.paymentStatus = paymentStatus;
      existingOrder.distance = formattedDistance;

      // Save the updated order to the database
      await existingOrder.save();

      return res.json({
        _id: existingOrder._id,
        action: 'Order Updated',
        message: 'Order has been updated successfully.',
        order: existingOrder,
      });
    } else {
      return res.status(400).json({ error: 'Invalid location data provided.' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
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