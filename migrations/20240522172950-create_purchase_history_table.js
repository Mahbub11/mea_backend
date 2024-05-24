'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("purchase", {

      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        onDelete: "CASCADE",
        autoIncrement:true
      },
      stone:{
        type:Sequelize.JSON,
        allowNull: true,
      },
      sand:{
        type:Sequelize.JSON,
        allowNull: true,
      },
      cement:{
        type:Sequelize.JSON,
        allowNull: true,
      },
      admixer:{
        type:Sequelize.JSON,
        allowNull: true,
      },
      bricks_chips:{
        type:Sequelize.JSON,
        allowNull: true,
      },
      miscellaneous:{
        type:Sequelize.JSON,
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
