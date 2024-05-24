"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sellsreports", {
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
      wid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "workorders", key: "id" },
        onDelete: "CASCADE",
        comment:'sell item id'
      },
     
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Total amount needs to provide" },
        },
      },
      paid_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
       
      },
      prev_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
       
      },
      tid:{
        type: Sequelize.BIGINT,
        allowNull:true,
        references: { model: "sellsreports", key: "id" },
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
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
