module.exports = (sequelize, Sequelize) => {
  const workOrder = sequelize.define("workorders", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      onDelete: "CASCADE",
      autoIncrement: true,
    },
    cid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "companys", key: "id" },
      onDelete: "CASCADE",
    },

    pid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
    },
    issue_date: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    address: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total_amount:{
      type:Sequelize.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Total amount needs to provide" },
      },
    },
    order_date: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    delivery_date: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    delivery_time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    delivery_address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    site_eng_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    site_eng_phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    
  });

  return workOrder;
};
