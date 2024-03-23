const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
// const Company= db.company
const Project = db.project;
const Sells = db.sells;
const Invoice= db.invoice

exports.createInvoice = catchAsyncError(async (req, res, next) => {
  try {
    const {
      cid,
      pid,
      sell_date,
      mpa,
      cubic_meter,
      cft_quantity,
      stone,
      sand,
      cement,
      admixer,
    } = req.body;
    await Sells.create({
      cid,
      pid,
      sell_date,
      mpa,
      cubic_meter,
      cft_quantity,
      stone,
      sand,
      cement,
      admixer,
    })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "Sells Created Successfully",
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.errors[0].message, 400));
      });
  } catch (error) {
    return next(new ErrorHandler("Sells Creating Failed", 400));
  }
});

exports.getInvoiceList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await Invoice.findByPk(id);
    } else {
      data = await Invoice.findAll();
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

exports.updateSells = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.body;
    const data = await Sells.findByPk(id);

    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      const SellsData = await Sells.update(req.body, {
        where: { id: id },
      });

      res.status(201).json({
        success: true,
        SellsData,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.errors[0].message, 400));
  }
});

exports.deleteSells = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Sells.findByPk(id);
    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      await Sells.destroy({
        where: { id: id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Sells Deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
