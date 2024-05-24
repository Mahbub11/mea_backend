'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("inventory", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        autoIncrement:true
      },
      stone:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sand:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      cement:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      admixer:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      bricks_chips:{
        type:Sequelize.DECIMAL(10, 2),
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


    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
