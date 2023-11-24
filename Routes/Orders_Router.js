
const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/Orders_Controller');

// Create a new order
router.post('/location', OrderController.createOrder);
router.get('/getOrders', OrderController.getAll)
router.delete('/delete/:orderID',OrderController.delete)
// router.get('/:orderId',OrderController.getOrderById)
module.exports = router;

