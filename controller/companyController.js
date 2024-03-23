const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const Company= db.company

exports.createCompany = catchAsyncError(async (req, res, next) => {

  try {

    const {name,description,address,email,phone}= req.body
    await Company
     .create({name,description,address,email,phone

     }).then((data) => {
        res.status(200).send({
          success: true,
          message:'Company Created Successfully',
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.errors[0].message, 400));
      });
  } catch (error) {
    return next(new ErrorHandler("Company Creating Failed", 400));
  }
});

exports.getCompanyList = catchAsyncError(async (req, res, next) => {

    try {
        const id = req.params.id;
        let data = null;
        if (id) {
          data = await Company.findByPk(id,{ include: ["projects"] });
        } else {
          data = await Company.findAll({ include: ["projects"] });
        }
    
        if (!data) {
          return next(new ErrorHandler("Id is invalid!", 400));
        } else {
          res.status(201).json({
            success: true,
            total: data.length,
            data,
          });
        }
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
  });

  
exports.updateCompany = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.body;
      const data = await Company.findByPk(id);
  
      if (!data) {
        return next(new ErrorHandler("Id is invalid!", 400));
      } else {
        const companyData = await Company.update(req.body, {
          where: { id: id },
        });
  
        res.status(201).json({
          success: true,
          companyData,
        });
      }
    } catch (error) {


        return next(new ErrorHandler(error.errors[0].message, 400));
    }
  });
  
  exports.deleteCompany = catchAsyncError(async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await Company.findByPk(id);
      if (!data) {
        return next(new ErrorHandler("Id is invalid!", 400));
      } else {
        await Company.destroy({
          where: { id: id },
        });
      }
  
      res.status(201).json({
        success: true,
        message: "Company Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  });