"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop any unique index/constraint on mortgages.username
    try {
      await queryInterface.removeIndex('mortgages', ['username']);
    } catch (e) {}
    try {
      await queryInterface.removeIndex('mortgages', 'mortgages_username_unique');
    } catch (e) {}
    try {
      await queryInterface.removeConstraint('mortgages', 'mortgages_username_key');
    } catch (e) {}

    // Ensure column is not unique
    try {
      await queryInterface.changeColumn('mortgages', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Optionally restore unique
    try {
      await queryInterface.changeColumn('mortgages', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex('mortgages', ['username'], { unique: true, name: 'mortgages_username_unique' });
    } catch (e) {}
  },
};
