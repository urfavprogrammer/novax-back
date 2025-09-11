"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      admin_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      admin_password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      admin_role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'admin',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admins");
  },
};
