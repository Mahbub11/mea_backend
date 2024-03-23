const router = require("express").Router();
const workOrderController= require('../controller/workOrderController');

router.post('/create',workOrderController.createWorkOrder)
router.get('/get/:id?',workOrderController.getworkOrderList)
router.put('/update',workOrderController.updateWorkOrder)
router.delete('/delete/:id',workOrderController.deleteWorkOrder)


module.exports= router;