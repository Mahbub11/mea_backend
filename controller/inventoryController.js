const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const Company = db.company;
const Inventory = db.inventory;
const PurchaseList = db.purchase;

exports.addItemToInventory = catchAsyncError(async (req, res, next) => {
  try {
    const { items } = req.body;

    const record = await Inventory.findOne({ raw: true });

    await Inventory.update(
      {
        sand:
          parseFloat(record.sand) +
          parseFloat(
            (items.find((obj) => obj.itemName === "sand") || { amount: "0" })
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
          parseFloat(record.admixer) +
          parseFloat(
            (items.find((obj) => obj.itemName === "admixer") || { amount: "0" })
              .amount
          ),

        bricks_chips:
          parseFloat(record.bricks_chips) +
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
      .then(async (data) => {
        await PurchaseList.create({
          sand: ((item) =>
            item
              ? { amount: item.amount, rate: item.rate }
              : { amount: "0", rate: "0" })(
            items.find((obj) => obj.itemName === "sand")
          ),
          cement: ((item) =>
            item
              ? { amount: item.amount, rate: item.rate }
              : { amount: "0", rate: "0" })(
            items.find((obj) => obj.itemName === "cement")
          ),
          stone: ((item) =>
            item
              ? { amount: item.amount, rate: item.rate }
              : { amount: "0", rate: "0" })(
            items.find((obj) => obj.itemName === "stone")
          ),
          admixer: ((item) =>
            item
              ? { amount: item.amount, rate: item.rate }
              : { amount: "0", rate: "0" })(
            items.find((obj) => obj.itemName === "admixer")
          ),
          bricks_chips: ((item) =>
            item
              ? { amount: item.amount, rate: item.rate }
              : { amount: "0", rate: "0" })(
            items.find((obj) => obj.itemName === "bricks_chips")
          ),
          miscellaneous: items.filter(
            (obj) => obj.itemName === "miscellaneous"
          ),
        }).then(() => {
          res.status(200).send({
            success: true,
            message: "Item Added Successfully",
          });
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new ErrorHandler(err.errors[0].message, 400));
      });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Company Creating Failed", 400));
  }
});

exports.getInventory = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await Inventory.findByPk(id);
    } else {
      data = await Inventory.findOne();
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

exports.getPrcaseList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await PurchaseList.findByPk(id);
    } else {
      data = await PurchaseList.findAll();
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
