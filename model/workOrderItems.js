module.exports = (sequelize, Sequelize) => {
  const workOrderItems = sequelize.define(
    "workorder_items",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        autoIncrement: true,
      },
      wid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "workorders", key: "id" },
        onDelete: "CASCADE",
      },
      materials_Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      materials_category: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      materials_quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Materials Quantity needs to provide" },
        },
      },
      materials_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Materials Rate needs to provide" },
        },
        
      },

      cubic_meter: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Cubic Meter needs to provide" },
        },
      },

      work_order_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      pump_charge: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      freezeTableName: true,
    }
  );

  return workOrderItems;
};
