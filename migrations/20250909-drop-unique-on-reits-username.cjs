"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop any unique index/constraint on reits.username
    try {
      await queryInterface.removeIndex('reits', ['username']);
    } catch (e) {}
    try {
      await queryInterface.removeIndex('reits', 'reits_username_unique');
    } catch (e) {}
    try {
      await queryInterface.removeConstraint('reits', 'reits_username_key');
    } catch (e) {}

    // Ensure column is not unique
    try {
      await queryInterface.changeColumn('reits', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Optionally restore unique
    try {
      await queryInterface.changeColumn('reits', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex('reits', ['username'], { unique: true, name: 'reits_username_unique' });
    } catch (e) {}
  },
};
