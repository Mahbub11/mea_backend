const router = require("express").Router();
const sellsController= require('../controller/sellsController');
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/create',sellsController.createSells)
router.get('/get/:id?',sellsController.getSellsList)
router.put('/update',sellsController.updateSells)
router.delete('/delete/:id',sellsController.deleteSells)
router.post('/pdf', upload.single('myfile'),sellsController.sendPdfFile)


module.exports= router;