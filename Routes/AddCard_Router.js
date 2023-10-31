const express = require('express');
const router = express.Router();
const AddCard_Controller = require('../Controller/AddCard_Controller');

// Create a new order
router.post('/', AddCard_Controller.create);
router.get('/getAll', AddCard_Controller.getAll)
router.get('/items/:id',AddCard_Controller.getItemById)
router.delete('/delete/:id',AddCard_Controller.delete)

module.exports = router;