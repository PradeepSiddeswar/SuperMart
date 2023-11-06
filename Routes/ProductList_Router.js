const express = require('express');
const router = express.Router();
const ProductList_Controller = require('../Controller/ProductList_Controller');

// Create a new order
router.post('/drinks-items', ProductList_Controller.create);
router.get('/getAll', ProductList_Controller.getAll)
router.get('/add-to-cart/:id',ProductList_Controller.getItemById)
router.delete('/delete/:id',ProductList_Controller.delete)

module.exports = router;