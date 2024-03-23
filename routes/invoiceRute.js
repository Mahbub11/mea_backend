const router = require("express").Router();
const invoiceController= require('../controller/invoiceController');



// router.post('/create',invoiceController.createSells)
router.get('/get/:id?',invoiceController.getInvoiceList)
// router.put('/update',sellsController.updateSells)
// router.delete('/delete/:id',sellsController.deleteSells)


module.exports= router;