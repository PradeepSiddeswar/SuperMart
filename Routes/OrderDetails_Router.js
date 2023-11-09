const express = require('express');
const router = express.Router();
const OrderDetails_Controller = require('../Controller/OrderDetails_Controller');

// Create a new order
router.post('/', OrderDetails_Controller.create);
router.get('/getAll', OrderDetails_Controller.getAll)
// router.get('/items/:id',AddCard_Controller.getItemById)
// router.delete('/delete/:id',AddCard_Controller.delete)

module.exports = router;