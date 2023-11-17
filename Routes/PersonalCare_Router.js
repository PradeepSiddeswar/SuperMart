const express = require('express');
const router = express.Router();
const Personalcare_Controller = require('../Controller/PersonalCare_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , Personalcare_Controller.create);
router.get('/get', Personalcare_Controller.getAll);
router.delete('/delete/:id',Personalcare_Controller.delete)


module.exports = router;