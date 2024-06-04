const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
// const Company= db.company
const Project= db.project

exports.createProject = catchAsyncError(async (req, res, next) => {

  try {

    const {cid,name,site_eng_name,site_eng_phone,address}= req.body
    await Project
     .create({cid,name,site_eng_name,site_eng_phone,address

     }).then((data) => {
        res.status(200).send({
          success: true,
          message:'Project Created Successfully',
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.errors[0].message, 400));
      });
  } catch (error) {
    return next(new ErrorHandler("Project Creating Failed", 400));
  }
});

exports.getProjectList = catchAsyncError(async (req, res, next) => {

    try {
        const id = req.params.id;
        let data = null;
        if (id) {
          data = await Project.findByPk(id,{ include: ["company"] });
        } else {
          data = await Project.findAll({ include: ["company"] });
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

  
exports.updateProject = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.body;
      const data = await Project.findByPk(id);
  
      if (!data) {
        return next(new ErrorHandler("Id is invalid!", 400));
      } else {
        const ProjectData = await Project.update(req.body, {
          where: { id: id },
        });
  
        res.status(201).json({
          success: true,
          ProjectData,
        });
      }
    } catch (error) {


        return next(new ErrorHandler(error.errors[0].message, 400));
    }
  });
  
  exports.deleteProject = catchAsyncError(async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await Project.findByPk(id);
      if (!data) {
        return next(new ErrorHandler("Id is invalid!", 400));
      } else {
        await Project.destroy({
          where: { id: id },
        });
      }
  
      res.status(201).json({
        success: true,
        message: "Project Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  });