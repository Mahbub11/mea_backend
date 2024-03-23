module.exports = (sequelize, Sequelize) => {
  const Inoice = sequelize.define("invoices", {
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
    srid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "sellsreports", key: "id" },
      onDelete: "CASCADE",
    },
    pid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
    },
    invoice_number: {
      type: Sequelize.TEXT,
      allowNull: false,
      onDelete: "CASCADE",
    },
    
    total_amount:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Total amount needs to provide" },
      },
    },
    vat:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: true,
     
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: true,
    },
   
    pump_charge: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return Inoice;
};
