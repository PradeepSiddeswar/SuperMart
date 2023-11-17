const express = require('express');
const router = express.Router();
const BeautypPoducts_Controller = require('../Controller/BeautyProducts_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , BeautypPoducts_Controller.create);
router.get('/get', BeautypPoducts_Controller.getAll);
router.delete('/delete/:id',BeautypPoducts_Controller.delete)


module.exports = router;