"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {
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
      srid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "sellsreports", key: "id" },
        onDelete: "CASCADE",
      },
      invoice_number: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
        onDelete: "CASCADE",
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Total amount needs to provide" },
        },
      },
      vat: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          notNull: { msg: "Paid Amount needs to provide" },
        },
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
