const router = require("express").Router();
const sellsReportController= require('../controller/sellsReportController');



router.post('/create',sellsReportController.createSellsReport)
router.get('/get/:id?',sellsReportController.getSellsReportList)
router.get('/get-existing-report/:id?',sellsReportController.findExistingSellsReport)
router.put('/update',sellsReportController.updateSellsReport)
router.put('/status-change',sellsReportController.SellsReportStatusChange)
router.delete('/delete/:id',sellsReportController.deleteSellsReport)


module.exports= router;