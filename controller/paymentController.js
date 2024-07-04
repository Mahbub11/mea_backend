const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
// const Company= db.company
const Sells = db.sells;
const sellsReport = db.sellsReport;

exports.updatePayment = catchAsyncError(async (req, res, next) => {
  try {
    const { id, received_amount, remaining_amount } = req.body;
    const data = await sellsReport.findByPk(id);

    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      console.log(received_amount, remaining_amount);

      let getStatus;
      if (remaining_amount <= 0) {
        getStatus = 4;
      }

      const SellsData = await sellsReport.update(
        {
          paid_amount: received_amount,
          total_amount: remaining_amount,
          status: getStatus,
        },
        {
          where: { id: id },
        }
      );

      res.status(201).json({
        success: true,
        SellsData,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.errors[0].message, 400));
  }
});
exports.getSellsReport = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      await sellsReport.findByPk(id, { raw: true }).then((res) => {
        if (res.status === 2) {
          return next(
            new ErrorHandler(
              `This Balance is transferred to Invoice-${res.tid}`,
              400
            )
          );
        }
      });

      data = await sellsReport.findByPk(id, {
        include: ["company", "project"],
      });
    } else {
      data = await sellsReport.findAll({ include: ["company", "project"] });
    }

    if (!data) {
      return next(new ErrorHandler("Id is invalid!", 400));
    } else {
      res.status(201).json({
        success: true,
        total: data.length,
        data: [data],
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
