module.exports = (sequelize, Sequelize) => {
  const SellsReport = sequelize.define("sellsreports", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      onDelete: "CASCADE",
      autoIncrement:true
    },
    cid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "companys", key: "id" },
      onDelete: "CASCADE",
    },
    wid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "workorders", key: "id" },
      onDelete: "CASCADE",
      comment:'sell item id'
    },
    
    total_amount:{
      type:Sequelize.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Total amount needs to provide" },
      },
    },
    paid_amount:{
      type:Sequelize.DECIMAL(12, 2),
      allowNull: true,
      
    },
    prev_amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0
     
    },
    tid:{
      type: Sequelize.BIGINT,
      allowNull: true,
   
      onDelete: "CASCADE",
      comment:'if this bill transfer to next sell,next sell id'

    },
    vat: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    pump_charge: {
      type:  Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    due_date: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    status:{
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    last_print: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return SellsReport;
};
