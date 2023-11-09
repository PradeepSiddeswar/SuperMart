const express = require('express');
const router = express.Router();
const ProductList_Controller = require('../Controller/ProductList_Controller');

// Create a new order
router.post('/drinks-items', ProductList_Controller.create);
router.get('/getAll', ProductList_Controller.getAll)
router.get('/add-to-cart/:id',ProductList_Controller.getItemById)
router.delete('/delete/:id',ProductList_Controller.delete)
router.get('/getAllitems-and-all',ProductList_Controller.getAllItems)
router.get('/all-categories/:categories_id',ProductList_Controller.getAllCategories)
module.exports = router;