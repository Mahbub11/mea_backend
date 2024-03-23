const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const WorkOrder = db.workOrder;

exports.createWorkOrder = catchAsyncError(async (req, res, next) => {
  try {
    const {
      cid,
      pid,
      sid,
      issue_date,
      address,
      subject,
      message,
      items,
      b_status,
      order_date,
      delivery_date,
      delivery_time,
      delivery_address,
      c_name,
      c_no,
    } = req.body;

    await WorkOrder.create({
      cid,
      pid,
      sid,
      issue_date,
      address,
      subject,
      message,
      items,
      b_status,
      order_date,
      delivery_date,
      delivery_time,
      delivery_address,
      c_name,
      c_no,
    })
      .then((data) => {
        res.status(200).send({
          success: true,
          message: "WorkOrder Created Successfully",
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.errors[0].message, 400));
      });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("WorkOrder Creating Failed", 400));
  }
});

exports.getworkOrderList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await WorkOrder.findByPk(id, { include: ["company", "project"] });
    } else {
      data = await WorkOrder.findAll({ include: ["company", "project"] });
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

exports.updateWorkOrder = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.body;
    const data = await WorkOrder.findByPk(id);

    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      const workOrderData = await WorkOrder.update(req.body, {
        where: { id: id },
      });

      res.status(201).json({
        success: true,
        workOrderData,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.errors[0].message, 400));
  }
});

exports.deleteWorkOrder = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await WorkOrder.findByPk(id);
    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      await WorkOrder.destroy({
        where: { id: id },
      });
    }

    res.status(201).json({
      success: true,
      message: "workOrder Deleted successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
