const dbConfig = require("../db/Database");
require("pg");
const Sequelize = require("sequelize");
// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: 'localhost',
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const sequelize = new Sequelize({
  //  Local
  // database: "readymix",
  // username: "postgres",
  // password: "123456",
  // host: "localhost",
  // port: 5432,
  // dialect: "postgres",

    // Live
  database: process.env.RDS_DB,
  username: "postgres",
  password:  process.env.RDS_DB_PASS,
  host:  process.env.RDS_HOST,
  port: 5432,
  dialect: "postgres",
  // dialectOptions: {
  //   ssl: {
  //       rejectUnauthorized: false
  //   }
  // },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.company = require("./companys")(sequelize, Sequelize);
db.project = require("./project")(sequelize, Sequelize);
db.sells = require("./sells")(sequelize, Sequelize);
db.sellsReport = require("./sellsReport")(sequelize, Sequelize);
db.invoice = require("./invoice")(sequelize, Sequelize);
db.workOrder = require("./workOrder")(sequelize, Sequelize);
db.inventory = require("./inventory")(sequelize, Sequelize);
db.purchase = require("./purchase")(sequelize, Sequelize);
db.workOrderItems = require("./workOrderItems")(sequelize, Sequelize);

db.company.hasMany(db.project, { foreignKey: "cid", as: "projects" });
db.project.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});

// db.project.hasMany(db.sells, { foreignKey: "pid", as: "sells" });
// db.sells.belongsTo(db.company, {
//   foreignKey: "cid",
//   as: "company",
// });
// db.sells.belongsTo(db.project, {
//   foreignKey: "pid",
//   as: "project",
// });

db.workOrder.hasMany(db.workOrderItems, {
  foreignKey: "wid",
  as: "workOrderItems",
});

// db.sellsReport.hasOne(db.workOrder,{foreignKey:'wid',as:'workorder'})
// db.workOrder.hasOne(db.company, { foreignKey: "cid", as: "company" });
// db.workOrder.hasOne(db.project, { foreignKey: "pid", as: "project" });
// db.sells.hasOne(db.workOrder, { foreignKey: "sid", as: "workorder" });
// db.sellsReport.hasMany(db.invoice, { foreignKey: "srid", as: "invoice" });
// db.sellsReport.hasOne(db.workOrder, { foreignKey: "srid", as: "workorder" });
// db.sellsReport.hasOne(db.invoice, { foreignKey: "srid", as: "invoice" });
// db.sellsReport.belongsTo(db.workOrderItems, {
//   targetkey:'wid',
//   foreignKey: "id",
//   as: "workOrderItems",
// });
// db.sellsReport.belongsToMany(db.workOrderItems, {
//   through: 'workOrder',
//   foreignKey: "wid",
//   targetkey:'wid',
//   as: "workorder1",
// });
db.sellsReport.hasMany(db.workOrderItems, {
  foreignKey: "wid",
  sourceKey: "wid",
  as: "workOrderItems",
});

db.sellsReport.belongsTo(db.workOrder, {
  foreignKey: "wid",
  as: "workorder",
});

db.workOrder.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});
db.workOrder.belongsTo(db.project, {
  foreignKey: "pid",
  as: "project",
});

db.sellsReport.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});
db.sellsReport.belongsTo(db.project, {
  foreignKey: "pid",
  as: "project",
});

module.exports = db;
