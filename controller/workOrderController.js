const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const WorkOrder = db.workOrder;
const Inventory = db.inventory;
const WorkOrderItems = db.workOrderItems;

const calculateAmountSand = (item) => {
  switch (parseInt(item.materials_category)) {
    case 20:
      return parseFloat(((item.cubic_meter * 770) / 38).toFixed(3));
    case 21:
      return parseFloat(((item.cubic_meter * 885) / 38).toFixed(3));
    case 25:
      return parseFloat(((item.cubic_meter * 900) / 38).toFixed(3));
    case 28:
      return parseFloat(((item.cubic_meter * 820) / 38).toFixed(3));
    case 30:
      return parseFloat(((item.cubic_meter * 820) / 38).toFixed(3));
    case 32:
      return parseFloat(((item.cubic_meter * 810) / 38).toFixed(3));
    case 35:
      return parseFloat(((item.cubic_meter * 800) / 38).toFixed(3));
    default:
      return 0;
  }
};

const calculateAmountCement = (item) => {
  switch (parseInt(item.materials_category)) {
    case 20:
      return parseFloat(((item.cubic_meter * 350) / 1000).toFixed(3));
    case 21:
      return parseFloat(((item.cubic_meter * 350) / 1000).toFixed(3));
    case 25:
      return parseFloat(((item.cubic_meter * 350) / 1000).toFixed(3));
    case 28:
      return parseFloat(((item.cubic_meter * 385) / 1000).toFixed(3));
    case 30:
      return parseFloat(((item.cubic_meter * 385) / 1000).toFixed(3));
    case 32:
      return parseFloat(((item.cubic_meter * 400) / 1000).toFixed(3));
    case 35:
      return parseFloat(((item.cubic_meter * 420) / 1000).toFixed(3));
    default:
      return 0;
  }
};

const calculateAmountStone = (item) => {
  switch (parseInt(item.materials_category)) {
    case 21:
      return parseFloat(((item.cubic_meter * 1052) / 1000).toFixed(3));
    case 25:
      return parseFloat(((item.cubic_meter * 1022) / 1000).toFixed(3));
    case 28:
    case 30:
    case 32:
    case 35:
      return parseFloat(((item.cubic_meter * 1040) / 1000).toFixed(3));
    default:
      return 0;
  }
};

const calculateAmountAdmixer = (item) => {
  switch (parseInt(item.materials_category)) {
    case 20:
    case 21:
      return parseFloat((item.cubic_meter * 1.5).toFixed(3));
    case 25:
      return parseFloat((item.cubic_meter * 2).toFixed(3));
    case 28:
    case 30:
      return parseFloat((item.cubic_meter * 2.5).toFixed(3));
    case 32:
      return parseFloat((item.cubic_meter * 3).toFixed(3));
    case 35:
      return parseFloat((item.cubic_meter * 3.5).toFixed(3));
    default:
      return 0;
  }
};

const calculateAmountBricks = (item) => {
  switch (parseInt(item.materials_category)) {
    case 20:
      return parseFloat(((item.cubic_meter * 1032) / 33).toFixed(3));
    default:
      return 0;
  }
};

const calculateMaterialAmounts = (item) => {
  const calculations = {
    20: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateBricks: calculateAmountBricks(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    21: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    25: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    28: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    30: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    32: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
    35: {
      calculateSand: calculateAmountSand(item),
      calculateCement: calculateAmountCement(item),
      calculateStone: calculateAmountStone(item),
      calculateAdmixer: calculateAmountAdmixer(item),
    },
  };

  return calculations[item.materials_category];
};

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
      total_amount,
    } = req.body;

    const record = await Inventory.findOne({ raw: true });


    const data = {
      record: record,
      items: items,
      res,
      next,
      wdata: {
        cid,
        pid,
        issue_date,
        address,
        subject,
        message,
        order_date,
        delivery_date,
        delivery_time,
        delivery_address,
        site_eng_name,
        site_eng_phone,
        status,
        total_amount,
      },
    };
    await workOrderHelper(data);

    // await WorkOrder.create({
    //   cid,
    //   pid,
    //   issue_date,
    //   address,
    //   subject,
    //   message,
    //   order_date,
    //   delivery_date,
    //   delivery_time,
    //   delivery_address,
    //   site_eng_name,
    //   site_eng_phone,
    //   status,
    //   total_amount,
    // })
    //   .then(async (data) => {
    //     await saveWorkOrderItems(data.id, items);
    //   })
    //   .catch((err) => {
    //     return next(new ErrorHandler(err.errors[0].message, 400));
    //   });
  } catch (error) {
 
    return next(new ErrorHandler("WorkOrder Creating Failed", 400));
  }
});

const saveWorkOrderItems = async (id, items) => {
  for (const val of items) {
    await WorkOrderItems.create({
      wid: id,
      materials_Name: val.materials_Name,
      materials_category: val.materials_category,
      materials_quantity: val.materials_quantity,
      materials_rate: val.materials_rate,
      cubic_meter: val.cubic_meter,
      work_order_amount: val.work_order_amount,
      pump_charge: val.pump_charge,
    });
  }
};

const processItemsAndUpdateInventory = async (
  items,
  record,
  res,
  wdata,
  next
) => {
  const insufficientItems = [];

  // Process each item
  for (const item of items) {
    const {
      calculateSand,
      calculateCement,
      calculateStone,
      calculateBricks,
      calculateAdmixer,
    } = calculateMaterialAmounts(item);

    const insufficientMaterials = [];

    if (parseFloat(record.sand) - calculateSand < 0) {
      insufficientMaterials.push("Sand");
    }
    if (parseFloat(record.cement) - calculateCement < 0) {
      insufficientMaterials.push("Cement");
    }
    if (parseFloat(record.stone) - calculateStone < 0) {
      insufficientMaterials.push("Stone");
    }
    if (parseFloat(record.bricks_chips) - calculateBricks < 0) {
      insufficientMaterials.push("Bricks");
    }
    if (parseFloat(record.admixer) - calculateAdmixer < 0) {
      insufficientMaterials.push("Admixer");
    }

    if (insufficientMaterials.length > 0) {
      insufficientItems.push({
        item,
        insufficientMaterials,
      });
    }
  }
  console.log("In "+insufficientItems.length)


  // Check if all items passed the inventory check
  if (insufficientItems.length === 0) {
    try {
      // Perform the updates
      for (const val of items) {
        if (parseInt(val.materials_category) === 20) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          // const calculateStone = calculateAmountStone(val);
          const calculateBricks = calculateAmountBricks(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);

          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.bricks_chips) - calculateBricks < 0) {
            insufficientMaterials.push("Bricks");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  bricks_chips:
                    parseFloat(record.bricks_chips) - calculateBricks,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.bricks_chips -= calculateBricks;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        }
        if (parseInt(val.materials_category) === 21) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);

          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        } else if (parseInt(val.materials_category) === 25) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);

          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        } else if (parseInt(val.materials_category) === 28) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);

          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        } else if (parseInt(val.materials_category) === 30) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);
          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        } else if (parseInt(val.materials_category) === 32) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);
          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        } else if (parseInt(val.materials_category) === 35) {
          const calculateSand = calculateAmountSand(val);
          const calculateCement = calculateAmountCement(val);
          const calculateStone = calculateAmountStone(val);
          const calculateAdmixer = calculateAmountAdmixer(val);

          console.log("Processing item:", val);
          console.log("Calculated amount to subtract:", calculateSand);
          const insufficientMaterials = [];

          if (parseFloat(record.sand) - calculateSand < 0) {
            insufficientMaterials.push("Sand");
          }
          if (parseFloat(record.cement) - calculateCement < 0) {
            insufficientMaterials.push("Cement");
          }
          if (parseFloat(record.stone) - calculateStone < 0) {
            insufficientMaterials.push("Stone");
          }
          if (parseFloat(record.admixer) - calculateAdmixer < 0) {
            insufficientMaterials.push("Admixer");
          }

          // Check if all quantities will remain non-negative before updating
          if (insufficientMaterials.length === 0) {
            try {
              // Perform the update
              await Inventory.update(
                {
                  sand: parseFloat(record.sand) - calculateSand,
                  cement: parseFloat(record.cement) - calculateCement,
                  stone: parseFloat(record.stone) - calculateStone,
                  admixer: parseFloat(record.admixer) - calculateAdmixer,
                },
                { where: { id: 1 } }
              );

              // Update the record after successful update
              record.sand -= calculateSand;
              record.cement -= calculateCement;
              record.stone -= calculateStone;
              record.admixer -= calculateAdmixer;

              console.log("Item processed, inventory updated successfully.");
            } catch (err) {
              console.error("Error updating inventory:", err);
            }
          } else {
            console.log(`Insufficient quantities for
             ${insufficientMaterials.join(", ")}. Inventory not updated.`);

            res.status(500).send({
              success: false,
              message: `Insufficient balance for
              ${insufficientMaterials.join(", ")}`,
            });
            return;
          }
        }
      }

      const {
        cid,
        pid,
        issue_date,
        address,
        subject,
        message,
        order_date,
        delivery_date,
        delivery_time,
        delivery_address,
        site_eng_name,
        site_eng_phone,
        status,
        total_amount,
      } = wdata;
      console.log(wdata);
      await WorkOrder.create({
        cid,
        pid,
        issue_date,
        address,
        subject,
        message,
        order_date,
        delivery_date,
        delivery_time,
        delivery_address,
        site_eng_name,
        site_eng_phone,
        status,
        total_amount,
      })
        .then(async (data) => {
          await saveWorkOrderItems(data.id, items);
          res.status(200).send({
            success: false,
            message: "All Saved",
          });
        })
        .catch((err) => {
          return next(new ErrorHandler(err.errors[0].message, 400));
        });
    } catch (err) {
      console.error("Error updating inventory:", err);
    }
  } else {
    // Respond with insufficient materials for each item
    const insufficientResponse = insufficientItems.map(
      ({ item, insufficientMaterials }) => ({
        item: item.materials_category,
        insufficientMaterials,
      })
    );

    console.log(
      "Insufficient quantities for some items:",
      insufficientResponse
    );

    // Example response handling (adjust as per your application)
    res.status(500).send({
      success: false,
      message: "Insufficient balance for some items.",
      insufficientItems: insufficientResponse,
    });
  }
};

const workOrderHelper = async ({ record, items, res, wdata, next }) => {
  processItemsAndUpdateInventory(items, record, res, wdata, next);

  return;
  console.log("Initial sand value:", record.sand);

  for (const val of items) {
  }

  console.log("All updates attempted, final sand value:", record.sand);

  const {
    cid,
    pid,
    issue_date,
    address,
    subject,
    message,
    order_date,
    delivery_date,
    delivery_time,
    delivery_address,
    site_eng_name,
    site_eng_phone,
    status,
    total_amount,
  } = wdata;
  console.log(wdata);
  await WorkOrder.create({
    cid,
    pid,
    issue_date,
    address,
    subject,
    message,
    order_date,
    delivery_date,
    delivery_time,
    delivery_address,
    site_eng_name,
    site_eng_phone,
    status,
    total_amount,
  })
    .then(async (data) => {
      await saveWorkOrderItems(data.id, items);
      res.status(200).send({
        success: false,
        message: "All Saved",
      });
    })
    .catch((err) => {
      return next(new ErrorHandler(err.errors[0].message, 400));
    });
};

exports.getworkOrderList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await WorkOrder.findByPk(id, {
        include: ["company", "project", "workOrderItems"],
      });
    } else {
      data = await WorkOrder.findAll({
        include: ["company", "project", "workOrderItems"],
      });
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
