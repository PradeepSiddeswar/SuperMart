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
router.post('/OrderIdAction', RegisterController.handleAction)
// router.get('/getAll', RegisterController.getAll)
router.get('/getallAction', RegisterController.getAllOrders)
router.get('/getAllUpdateOrders', RegisterController.getAllUpdateOrders)

router.put('/orders/:id', RegisterController.updateOrder);
router.delete('/delete/:orderID',RegisterController.delete)
module.exports = router;

