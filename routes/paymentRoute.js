const router = require("express").Router();
const paymentController= require('../controller/paymentController');



router.put('/pay',paymentController.updatePayment)
router.get('/info-get/:id?',paymentController.getSellsReport)


module.exports= router;