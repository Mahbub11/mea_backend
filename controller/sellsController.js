const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const db = require("../model/index");
const nodemailer = require("nodemailer");
const base64 = require("base64topdf");
const PDFDocument = require("pdfkit");
var blobStream = require("blob-stream");
var fs = require("fs");
// const Company= db.company
const Project = db.project;
const Sells = db.sells;
const Inventory = db.inventory;
const sellesReport = db.sellsReport;
const workOrderItems = db.workOrderItems;
const WorkOrder = db.workOrder;

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

exports.createSells = catchAsyncError(async (req, res, next) => {
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

exports.getSellsList = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = null;
    if (id) {
      data = await Sells.findByPk(id, {
        include: ["company", "project", "workorder"],
      });
    } else {
      data = await Sells.findAll({
        include: ["company", "project", "workorder"],
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
    const workOrder = await WorkOrder.findByPk(id, { raw: true });

    const items = await workOrderItems.findAll({
      where: {
        wid: workOrder.id,
      },
      raw: true,
    });
    const record = await Inventory.findOne({ raw: true });

    await workOrderHelper(record, items);

    await workOrderItems.destroy({ where: { wid: id } });
    await WorkOrder.destroy({ where: { id: id } })
      .then((data) => {
        res.status(201).json({
          success: true,
          message: "Sells Deleted successfully!",
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err, 400));
      });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const workOrderHelper = async (record, items) => {
  console.log("Initial sand value:", record.sand);

  for (const val of items) {
    if (parseInt(val.materials_category) === 20) {
      let totalSand = 0;
      let totalCement = 0;
      let totalBricks = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateBricks = calculateAmountBricks(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateBricks,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalBricks += calculateBricks;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalBricks,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            bricks_chips: parseFloat(record.bricks_chips) + totalBricks,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.bricks_chips += totalBricks;
        record.admixer += totalAdmixer;
        console.log(
          "Inventory updated successfully. Current values - Sand:",
          record.sand,
          "Cement:",
          record.cement,
          "Stone:",
          record.bricks_chips,
          "Admixer:",
          record.admixer
        );
      } catch (err) {
        console.error("Error updating inventory:", err);
      }
    } else if (parseInt(val.materials_category) === 21) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;
        console.log(
          "Inventory updated successfully. Current values - Sand:",
          record.sand,
          "Cement:",
          record.cement,
          "Stone:",
          record.stone,
          "Admixer:",
          record.admixer
        );
      } catch (err) {
        console.error("Error updating inventory:", err);
      }
    } else if (parseInt(val.materials_category) === 25) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;

        console.log(
          "Inventory updated successfully. Current values - Sand:",
          record.sand,
          "Cement:",
          record.cement,
          "Stone:",
          record.stone,
          "Admixer:",
          record.admixer
        );
      } catch (err) {
        console.error("Error updating inventory:", err);
      }
    } else if (parseInt(val.materials_category) === 28) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;

        console.log(
          "Inventory updated successfully. Current values - Sand:",
          record.sand,
          "Cement:",
          record.cement,
          "Stone:",
          record.stone,
          "Admixer:",
          record.admixer
        );
      } catch (err) {
        console.error("Error updating inventory:", err);
      }
    } else if (parseInt(val.materials_category) === 30) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;
      } catch (err) {
        console.error("Error saving item:", err);
      }
    } else if (parseInt(val.materials_category) === 32) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;
      } catch (err) {
        console.error("Error saving item:", err);
      }
    } else if (parseInt(val.materials_category) === 35) {
      let totalSand = 0;
      let totalCement = 0;
      let totalStone = 0;
      let totalAdmixer = 0;

      for (const val of items) {
        const calculateSand = calculateAmountSand(val);
        const calculateCement = calculateAmountCement(val);
        const calculateStone = calculateAmountStone(val);
        const calculateAdmixer = calculateAmountAdmixer(val);

        console.log("Processing item:", val);
        console.log(
          "Calculated amounts to add/subtract:",
          calculateSand,
          calculateCement,
          calculateStone,
          calculateAdmixer
        );

        totalSand += calculateSand;
        totalCement += calculateCement;
        totalStone += calculateStone;
        totalAdmixer += calculateAdmixer;
      }

      console.log(
        "Total changes to inventory - Sand:",
        totalSand,
        "Cement:",
        totalCement,
        "Stone:",
        totalStone,
        "Admixer:",
        totalAdmixer
      );

      try {
        await Inventory.update(
          {
            sand: parseFloat(record.sand) + totalSand,
            cement: parseFloat(record.cement) + totalCement,
            stone: parseFloat(record.stone) + totalStone,
            admixer: parseFloat(record.admixer) + totalAdmixer,
          },
          { where: { id: 1 } }
        );

        // Update record values for the next use
        record.sand += totalSand;
        record.cement += totalCement;
        record.stone += totalStone;
        record.admixer += totalAdmixer;
        console.log("Item processed, current sand value:", record.sand);
      } catch (err) {
        console.error("Error saving item:", err);
      }
    }
  }

  console.log("All updates attempted, final sand value:", record.sand);
};

exports.sendPdfFile = catchAsyncError(async (req, res, next) => {
  try {
    const { originalname } = req.file;
    let usersPath = "/tmp/${originalname}.pdf";

    const { subject, text } = req.body;
    var transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      secure: true,
      secureConnection: false, // TLS requires secureConnection to be false
      tls: {
        ciphers: "SSLv3",
      },
      requireTLS: true,
      port: process.env.SMPT_PORT,
      debug: true,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      debug: true, // Enable debug output
    });

    // Write the buffer data to a new PDF file
    fs.writeFile(usersPath, req.file.buffer, (err) => {
      if (err) {
        console.error("Error writing PDF file:", err);
      } else {
        console.log("PDF file has been successfully created:", usersPath);

        // Define the email message
        const mailOptions = {
          from: "SMART CONSTRUCTION LTD <info@scs-rmcbd.com>",
          to: "mahbubrahim926@gmail.com",
          subject: subject,
          text: text,
          attachments: [
            {
              filename: originalname + ".pdf",
              path: usersPath,
            },
          ],
        };

        // Send the email with the PDF file attachment
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({
              success: true,
              message: "Email sent Failed.",
            });
          } else {
            console.log("Email sent:", info.response);
            res.status(201).json({
              success: true,
              message: "Email sent successfully.",
            });
          }

          // Delete the PDF file after sending the email
          fs.unlink(outputPath, (err) => {
            if (err) {
              console.error("Error deleting PDF file:", err);
            } else {
              console.log("PDF file has been deleted:", outputPath);
            }
          });
        });
      }
    });
  } catch (error) {}
});
const sendMail = async (file) => {
  var transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: process.env.SMPT_PORT,
    debug: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: "PracticeCompanions <info@practicecompanions.com>",
    to: "mahbubrahim926@gmail.com",
    subject: "AS",
    text: "AS",
    attachments: [
      {
        filename: "dd",
        content: file,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
