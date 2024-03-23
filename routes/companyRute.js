const router = require("express").Router();
const companyController= require('../controller/companyController');



router.post('/create',companyController.createCompany)
router.get('/get/:id?',companyController.getCompanyList)
router.put('/update',companyController.updateCompany)
router.delete('/delete/:id',companyController.deleteCompany)


module.exports= router;