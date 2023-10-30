
const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/Orders_Controller');

// Create a new order
router.post('/location', OrderController.createOrder);
router.get('/getAll', OrderController.getAll)
router.delete('/delete/:id',OrderController.delete)

module.exports = router;

