const express = require('express');
const router = express.Router();
const Cooking_Controller = require('../Controller/CookingVessels_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , Cooking_Controller.create);
router.get('/get', Cooking_Controller.getAll);
router.delete('/delete/:id',Cooking_Controller.delete)


module.exports = router;