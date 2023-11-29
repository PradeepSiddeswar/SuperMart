const express = require('express');
const router = express.Router();
const TabsList_Controller = require('../Controller/TabsList_Controller');

// Create a new order
router.post('/', TabsList_Controller.create);
router.get('/getAll', TabsList_Controller.getAll)
router.delete('/delete/:id',TabsList_Controller.delete)

module.exports = router;