const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const WorkOrder = db.workOrder;
const Inventory = db.inventory;

exports.createWorkOrder = catchAsyncError(async (req, res, next) => {
  try {
    const {
      cid,
      pid,
      issue_date,
      address,
      subject,
      message,
      items,
      order_date,
      delivery_date,
      delivery_time,
      delivery_address,
      site_eng_name,
      site_eng_phone,
      status,
      total_amount
    } = req.body;

    await Inventory.update(
      {
        sand:
          parseFloat(record.sand) +
          parseFloat(
            (items.find((obj) => obj.materials_category === 28) || { amount: "0" })
              .amount
          ),
        cement:
          parseFloat(record.cement) +
          parseFloat(
            (items.find((obj) => obj.itemName === "cement") || { amount: "0" })
              .amount
          ),

        stone:
          parseFloat(record.stone) +
          parseFloat(
            (items.find((obj) => obj.itemName === "stone") || { amount: "0" })
              .amount
          ),

        admixer:
          parseFloat(record.cement) +
          parseFloat(
            (items.find((obj) => obj.itemName === "admixer") || { amount: "0" })
              .amount
          ),

        bricks_chips:
          parseFloat(record.cement) +
          parseFloat(
            (
              items.find((obj) => obj.itemName === "bricks_chips") || {
                amount: "0",
              }
            ).amount
          ),
      },
      { where: { id: 1 } }
    )
    
    .then(res=>{
      console.log('Saved')
    }).catch(err=>{
      console.log(err)
    })

    // items.map((val,key)=>{
    //   if(val.materials_category===21){


    //   }
    // })

    console.log(items)

    return
    await WorkOrder.create({
      cid,
      pid,
      issue_date,
      address,
      subject,
      message,
      items,
      order_date,
      delivery_date,
      delivery_time,
      delivery_address,
      site_eng_name,
      site_eng_phone,
      status,
      total_amount
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
