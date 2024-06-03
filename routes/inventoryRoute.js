const router = require("express").Router();
const inventoryController= require('../controller/inventoryController');



router.post('/create-item',inventoryController.addItemToInventory)
router.get('/get',inventoryController.getInventory)
router.get('/get-purchase',inventoryController.getPrcaseList)


module.exports= router;