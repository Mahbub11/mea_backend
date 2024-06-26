const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const WorkOrder = db.workOrder;
const Inventory = db.inventory;
const WorkOrderItems = db.workOrderItems;

const calculateAmountSand = (item) => {
  switch (parseInt(item.materials_category)) {
    case 21:
      return ((item.cubic_meter * 865) / 3).toFixed(2);

    case 25:
      return ((item.cubic_meter * 850) / 35).toFixed(2);

    case 28:
      return ((item.cubic_meter * 820) / 35).toFixed(2);

    case 30:
      return ((item.cubic_meter * 820) / 35).toFixed(2);

    case 32:
      return ((item.cubic_meter * 810) / 35).toFixed(2);

    case 35:
      return ((item.cubic_meter * 770) / 35).toFixed(2);

    default:
      return 0;
  }
};

const calculateAmountCement = (item) => {
  switch (parseInt(item.materials_category)) {
    case 21:
      return ((item.cubic_meter * 370) / 1000).toFixed(2);

    case 25:
      return ((item.cubic_meter * 385) / 1000).toFixed(2);

    case 28:
      return ((item.cubic_meter * 400) / 1000).toFixed(2);

    case 30:
      return ((item.cubic_meter * 400) / 1000).toFixed(2);

    case 32:
      return ((item.cubic_meter * 410) / 1000).toFixed(2);

    case 35:
      return ((item.cubic_meter * 430) / 1000).toFixed(2);

    default:
      return 0;
  }
};
const calculateAmountStone = (item) => {
  switch (parseInt(item.materials_category)) {
    case 21:
      return ((item.cubic_meter * 1075) / 1000).toFixed(2);

    case 25:
      return ((item.cubic_meter * 1040) / 1000).toFixed(2);

    case 28:
      return ((item.cubic_meter * 1040) / 1000).toFixed(2);

    case 30:
      return ((item.cubic_meter * 1040) / 1000).toFixed(2);

    case 32:
      return ((item.cubic_meter * 1040) / 1000).toFixed(2);

    case 35:
      return ((item.cubic_meter * 1060) / 1000).toFixed(2);

    default:
      return 0;
  }
};

const calculateAmountAdmixer = (item) => {
  switch (parseInt(item.materials_category)) {
    case 21:
      return (item.cubic_meter * 1.5).toFixed(2);

    case 25:
      return (item.cubic_meter * 2.5).toFixed(2);

    case 28:
      return (item.cubic_meter * 3).toFixed(2);

    case 30:
      return (item.cubic_meter * 3).toFixed(2);

    case 32:
      return (item.cubic_meter * 3.5).toFixed(2);

    case 35:
      return (item.cubic_meter * 3.5).toFixed(2);

    default:
      return 0;
  }
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
    console.log(items);
    console.log(record);

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
    console.log(error);
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

const workOrderHelper = async ({ record, items, res, wdata, next }) => {
  console.log("Initial sand value:", record.sand);

  for (const val of items) {
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
      }
    } else if (parseInt(val.materials_category) === 30) {
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
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
         ${insufficientMaterials.join(', ')}. Inventory not updated.`);

         res.status(500).send({
          success: false,
          message: `Insufficient balance for
          ${insufficientMaterials.join(', ')}`
        });
        return
      }
    }
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
