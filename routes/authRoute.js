const router = require("express").Router();
const authController= require('../controller/authController');
const { isAuthenticated } = require("../middleware/auth");



router.post('/signin',authController.signIn)
router.get('/getuser',isAuthenticated,authController.getUser)


module.exports= router;