"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop any unique index/constraint on savings.username
    try {
      await queryInterface.removeIndex('savings', ['username']);
    } catch (e) {
      // ignore if index doesn't exist
    }
    try {
      await queryInterface.removeConstraint('savings', 'savings_username_key');
    } catch (e) {
      // ignore if constraint doesn't exist
    }
    try {
      await queryInterface.changeColumn('savings', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      });
    } catch (e) {
      // ignore if already changed
    }
  },

  async down(queryInterface, Sequelize) {
    // Re-add unique on savings.username (only if needed)
    try {
      await queryInterface.changeColumn('savings', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
  },
};
