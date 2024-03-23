'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mpa:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "mpa needs to provide" },
        },
      },
      cubic_meter:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "cubic_meter needs to provide" },
        },
      },
      cft_quantity:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "cft needs to provide" },
        },
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
