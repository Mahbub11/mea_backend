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
    sid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: true,
      references: { model: "sells", key: "id" },
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
    items: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    b_status: {
      type: Sequelize.STRING,
      allowNull: false,
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
    c_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    c_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return workOrder;
};
