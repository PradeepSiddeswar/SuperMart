const express = require('express');
const router = express.Router();
const TopList_Controller = require('../Controller/TopList_Controller');

// Create a new order
router.post('/', TopList_Controller.create);
router.get('/getAll', TopList_Controller.getAll)
router.delete('/delete/:id',TopList_Controller.delete)

module.exports = router;