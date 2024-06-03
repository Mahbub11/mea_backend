"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workorder_items", {
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
