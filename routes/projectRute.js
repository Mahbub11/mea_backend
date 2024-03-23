const router = require("express").Router();
const projectController= require('../controller/projectController');



router.post('/create',projectController.createProject)
router.get('/get/:id?',projectController.getProjectList)
router.put('/update',projectController.updateProject)
router.delete('/delete/:id',projectController.deleteProject)


module.exports= router;