const  RegisterModel= require('../Model/Register_Model');
const OrderAccept = require('../Model/OrderAccept_Model')
const socketIo = require('socket.io');
const http = require('http'); // Require http module
const express = require('express');
const mongoose = require('mongoose'); // Make sure you import mongoose

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
  const { _id, DropLocation, PickUpLocation, items, paymentResult, action } = req.body;

  if (action !== 'accept' && action !== 'reject' && action !== 'delivery') {
    return res.status(400).json({ error: 'Invalid action specified.' });
  }

  try {
    // Fetch details based on the provided ID from the RegisterModel
    const registerItem = await RegisterModel.findById(_id);

    if (!registerItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const orderID = generateOrderID();
    const timestamp = new Date();

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

      // Create an order object
      const order = new OrderAccept({
        action,
        orderID,
        DropLocation: orderLocation,
        PickUpLocation: currentLocation,
        timestamp,
        items,
        totalAmount,
        totalQuantity,
        paymentStatus,
        distance: formattedDistance,
      });

      order.save()
        .then(() => {
          // Emit the new location to all connected clients
          io.emit('locationUpdate', { orderID, DropLocation, PickUpLocation, timestamp });

          // Construct the response based on the action
          let response = {};

          if (action === 'accept') {
            response = {
              action: 'Order Accepted',
              name: registerItem.name, // Include the name from registerItem
              orderID,
              distance: formattedDistance,
              timestamp,
              DropLocation: orderLocation,
              PickUpLocation: currentLocation,
              items,
              totalAmount,
              totalQuantity,
              paymentStatus,
            };
          } else if (action === 'reject') {
            response = {
              action: 'Order Rejected',
              name: registerItem.name, // Include the name from registerItem
              orderID,
              distance: formattedDistance,
              timestamp,
              DropLocation: orderLocation,
              PickUpLocation: currentLocation,
              items,
              totalAmount,
              totalQuantity,
              paymentStatus,
            };
          } else if (action === 'delivery') {
            response = {
              action: 'Order Delivered',
              name: registerItem.name, // Include the name from registerItem
              orderID,
              distance: formattedDistance,
              timestamp,
              DropLocation: orderLocation,
              PickUpLocation: currentLocation,
              items,
              totalAmount,
              totalQuantity,
              paymentStatus,
            };
          }

          res.status(201).json(response);
        })
        .catch((err) => {
          console.error('Error:', err);
          res.status(500).json({ error: 'An error occurred.' });
        });
    } else {
      res.status(400).json({ error: 'Invalid location data' });
    }
  } catch (error) {
    console.error('Error handling action and order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All 
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderAccept.find().populate('registerModel');
    console.log('All Orders:', orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    const formattedOrders = orders.map(order => {
      let formattedAction = '';

      switch (order.action) {
        case 'accept':
          formattedAction = 'Order Accepted';
          break;
        case 'reject':
          formattedAction = 'Order Rejected';
          break;
        case 'delivery':
          formattedAction = 'Order Delivered';
          break;
        default:
          formattedAction = order.action;
          break;
      }

      const distance = calculateDistance(
        order.DropLocation.latitude,
        order.DropLocation.longitude,
        order.PickUpLocation.latitude,
        order.PickUpLocation.longitude
      );

      const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

      return {
        action: formattedAction,
        name: (order.registerModel && order.registerModel.name) ? order.registerModel.name : 'Name Unknown',
        orderID: order.orderID,
        timestamp: order.timestamp,
        DropLocation: order.DropLocation,
        PickUpLocation: order.PickUpLocation,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        distance: formattedDistance,
      };
    });

    res.status(200).json({
      message: 'All orders retrieved successfully',
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders', message: error.message });
  }
};







exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { DropLocation, PickUpLocation, items, paymentResult, action } = req.body;

  try {
    // Your validation and error handling code can be placed here

    // Your logic to update the order details...
    let totalAmount = 0;
    let totalQuantity = 0;

    for (const item of items) {
      totalAmount += item.price * item.quantity;
      totalQuantity += item.quantity;
    }

    const paymentStatus = paymentResult === 'success' ? 'Paid' : 'Failed';

    const orderLocation = DropLocation;
    const currentLocation = PickUpLocation;

    if (orderLocation && currentLocation) {
      // Calculate distance using the obtained coordinates
      const distance = calculateDistance(
        orderLocation.latitude,
        orderLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude
      );

      const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;

      // Fetch the existing order from the database using orderId
      const existingOrder = await OrderAccept.findById(orderId);

      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found for the provided ID' });
      }

      // Update the existing order's fields including the distance
      existingOrder.DropLocation = orderLocation;
      existingOrder.PickUpLocation = currentLocation;
      existingOrder.items = items;
      existingOrder.totalAmount = totalAmount;
      existingOrder.totalQuantity = totalQuantity;
      existingOrder.paymentStatus = paymentStatus;
      existingOrder.distance = formattedDistance; // Include the distance in the order

      // Save the updated order to the database
      await existingOrder.save();

      // Construct the response with updated order details
      const response = {
        message: 'Order Devlivery successfully',
        _id: existingOrder._id,
        // Include other necessary fields in the response based on your schema
        DropLocation: existingOrder.DropLocation,
        PickUpLocation: existingOrder.PickUpLocation,
        items: existingOrder.items,
        totalAmount: existingOrder.totalAmount,
        totalQuantity: existingOrder.totalQuantity,
        paymentStatus: existingOrder.paymentStatus,
        distance: existingOrder.distance,
        // Include any other required fields from the order object
      };

      return res.json(response);
    } else {
      return res.status(400).json({ error: 'Invalid location data provided.' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};



exports.getAllUpdateOrders = async (req, res) => {
  try {
    const orders = await OrderAccept.find(); 

    // Construct the response with all order details
    const response = orders.map(order => ({
      _id: order._id,
      DropLocation: order.DropLocation,
      PickUpLocation: order.PickUpLocation,
      items: order.items,
      totalAmount: order.totalAmount,
      totalQuantity: order.totalQuantity,
      paymentStatus: order.paymentStatus,
      distance: order.distance,
      // Include any other required fields from the order object
    }));

    const message = 'Order Devlivery successfully';

    return res.json({ message, orders: response });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: `Internal server error: ${error.message}` });
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
exports.delete = async (req, res) => {
  const { orderID } = req.params; // Assuming orderID is in the request parameters

  try {
    // Find the order by orderID and remove it
    const deletedOrder = await OrderAccept.findOneAndDelete({ orderID });

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      deletedOrder,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
