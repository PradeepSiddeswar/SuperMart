const express = require('express');
const RegisterController = require('../Controller/Register_Controller');
const router = express.Router();
const homepagemulter = require('../Config/Homepage_Multer')

router.post('/create', homepagemulter.fields([
  { name: 'panImage' },
  { name: 'aadharImage' },
  { name: 'drivingLicenseImage' },
  { name: 'documentImage' }
]), RegisterController.create);

router.get('/getAll', RegisterController.getAll)
router.delete('/delete/:id',RegisterController.delete)

module.exports = router;

