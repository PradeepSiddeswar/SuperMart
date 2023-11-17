const express = require('express');
const router = express.Router();
const HomePage_Controller = require('../Controller/HomePage_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , HomePage_Controller.create);
router.get('/get', HomePage_Controller.getAll);
router.delete('/delete/:id',HomePage_Controller.delete)


module.exports = router;