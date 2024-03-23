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
  database: "railway",
  username: "postgres",
  password: "aWiJIpNVygwKOHdnOqjDsurUJlPRQcFv",
  host: "monorail.proxy.rlwy.net",
  port: 52942,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
        rejectUnauthorized: false
    }
  },

  // pool: {
  //   max: dbConfig.pool.max,
  //   min: dbConfig.pool.min,
  //   acquire: dbConfig.pool.acquire,
  //   idle: dbConfig.pool.idle,
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

db.company.hasMany(db.project, { foreignKey: "cid", as: "projects" });
db.project.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});

db.project.hasMany(db.sells, { foreignKey: "pid", as: "sells" });
db.sells.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});
db.sells.belongsTo(db.project, {
  foreignKey: "pid",
  as: "project",
});

db.sells.hasOne(db.workOrder, { foreignKey: "sid", as: "workorder" });
db.sellsReport.hasMany(db.invoice, { foreignKey: "srid", as: "invoice" });
// db.sellsReport.hasOne(db.workOrder, { foreignKey: "srid", as: "workorder" });
// db.sellsReport.hasOne(db.invoice, { foreignKey: "srid", as: "invoice" });

db.sellsReport.belongsTo(db.company, {
  foreignKey: "cid",
  as: "company",
});
db.sellsReport.belongsTo(db.project, {
  foreignKey: "pid",
  as: "project",
});


module.exports = db;
