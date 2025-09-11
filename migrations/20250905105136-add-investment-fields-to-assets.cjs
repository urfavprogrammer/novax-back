'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('assets', 'investment_status', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('assets', 'investment_date', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('assets', 'investment_status');
    await queryInterface.removeColumn('assets', 'investment_date');
  }
};
