const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
// const Company= db.company
const Sells = db.sells;
const sellsReport = db.sellsReport;
const WorkOrder= db.workOrder

exports.createSellsReport = catchAsyncError(async (req, res, next) => {
  try {
    const {
      description,
      cid,
      pid,
      unit,
      unit_rate,
      total_amount,
      status,
      vat,
      remarks,
      pump_charge,
      due_date,
      wid,
    } = req.body;
    console.log(req.body)

    await sellsReport
      .create({
        description,
        cid,
        pid,
        unit,
        unit_rate,
        total_amount,
        status,
        vat,
        pump_charge,
        due_date,
        paid_amount:0,
        wid
      })
      .then(async (data) => {
        await WorkOrder.update({status : 1}, {
          where: { id: wid },
        });
        res.status(200).send({
          success: true,
          message: "Invoice Saved",
          id:data.id
        });
      });
  } catch (error) {
    console.log(error);

    return next(new ErrorHandler(error, 400));
  }
});

exports.getSellsReportList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await sellsReport.findByPk(id, {
        include: ["company", "project",'workorder','workOrderItems'],
      });
    } else {
      data = await sellsReport.findAll({ include: ["company", "project",'workorder','workOrderItems'] });
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

exports.updateSellsReport = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.body;
    const data = await sellsReport.findByPk(id);

    

    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      const SellsData = await sellsReport.update(req.body, {
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

exports.deleteSellsReport = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await sellsReport.findByPk(id);
    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      await Sells.update({status:0}, {
        where: { id: data.sid },
      }).then(async()=>{
        await sellsReport.destroy({
        where: { id: id },
      });
      });
      
    }

    res.status(201).json({
      success: true,
      message: "Sells-Report Deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

exports.findExistingSellsReport = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const findExistingOne = await sellsReport.findOne({
      where: { sid: id },
      include: ["company", "project", "invoice"],
    });

    if (findExistingOne) {
      res.status(201).json({
        success: true,
        data: findExistingOne,
        message: "Sells Record Found",
      });
    } else {
      res.status(201).json({
        success: false,
        message: "Existing Sells Record Not Found",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

exports.SellsReportStatusChange = catchAsyncError(async (req, res, next) => {
  try {
    const {id,status} = req.body;
    const findExistingOne = await sellsReport.update(req.body, {
      where: { id: id },
    });

    if (findExistingOne) {
      res.status(201).json({
        success: true,
        data: findExistingOne,
        message: "Status Changed",
      });
    } else {
      res.status(201).json({
        success: false,
        message: "Existing Sells Record Not Found",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

