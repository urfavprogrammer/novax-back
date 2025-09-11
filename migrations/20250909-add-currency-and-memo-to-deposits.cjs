"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add optional fields for better history context
    await queryInterface.addColumn("deposits", "depositcurrency", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("deposits", "depositmemo", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("deposits", "depositmemo");
    await queryInterface.removeColumn("deposits", "depositcurrency");
  },
};
