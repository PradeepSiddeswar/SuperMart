const express = require('express');
const router = express.Router();
const CategoryDetails_Controller = require('../Controller/CategoryDetails_Controller');

// Create a new order
router.post('/', CategoryDetails_Controller.create);
router.get('/getAll', CategoryDetails_Controller.getAll)
router.delete('/delete/:id',CategoryDetails_Controller.delete)

module.exports = router;