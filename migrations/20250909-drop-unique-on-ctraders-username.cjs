"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove any unique index/constraint on ctraders.username
    try {
      await queryInterface.removeIndex('ctraders', ['username']);
    } catch (e) {}
    try {
      // Some setups name the index explicitly
      await queryInterface.removeIndex('ctraders', 'ctraders_username_unique');
    } catch (e) {}
    try {
      await queryInterface.removeConstraint('ctraders', 'ctraders_username_key');
    } catch (e) {}

    // Ensure column definition is not unique
    try {
      await queryInterface.changeColumn('ctraders', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Restore unique if needed
    try {
      await queryInterface.changeColumn('ctraders', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex('ctraders', ['username'], { unique: true, name: 'ctraders_username_unique' });
    } catch (e) {}
  },
};
