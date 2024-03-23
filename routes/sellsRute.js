const router = require("express").Router();
const sellsController= require('../controller/sellsController');



router.post('/create',sellsController.createSells)
router.get('/get/:id?',sellsController.getSellsList)
router.put('/update',sellsController.updateSells)
router.delete('/delete/:id',sellsController.deleteSells)


module.exports= router;