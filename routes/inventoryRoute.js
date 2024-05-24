const router = require("express").Router();
const inventoryController= require('../controller/inventoryController');



router.post('/create-item',inventoryController.addItemToInventory)
// router.get('/get',projectController.getProjectList)


module.exports= router;