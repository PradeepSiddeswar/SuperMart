const express = require('express');
const router = express.Router();
const kitchenessntials_Controller = require('../Controller/KitchenEssentials_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , kitchenessntials_Controller.create);
router.get('/get', kitchenessntials_Controller.getAll);
router.delete('/delete/:id',kitchenessntials_Controller.delete)


module.exports = router;