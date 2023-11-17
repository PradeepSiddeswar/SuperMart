const express = require('express');
const router = express.Router();
const Fruit_Controller = require('../Controller/FruitVeggies_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , Fruit_Controller.create);
router.get('/get', Fruit_Controller.getAll);
router.delete('/delete/:id',Fruit_Controller.delete)


module.exports = router;