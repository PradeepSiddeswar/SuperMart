const express = require('express');
const router = express.Router();
const SingleBanner_Controller = require('../Controller/SingleBanner_Controller');
const homepagemulter = require('../Config/Homepage_Multer')


router.post('/', homepagemulter.single("image") , SingleBanner_Controller.create);
router.get('/get', SingleBanner_Controller.getAll);
router.delete('/delete/:id', SingleBanner_Controller.delete)


module.exports = router;