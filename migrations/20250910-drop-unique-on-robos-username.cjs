"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove possible indexes/constraints
    try { await queryInterface.removeIndex('robos', ['username']); } catch (e) {}
    try { await queryInterface.removeIndex('robos', 'robos_username_unique'); } catch (e) {}
    try { await queryInterface.removeConstraint('robos', 'robos_username_key'); } catch (e) {}

    // Ensure column no longer has unique
    try {
      await queryInterface.changeColumn('robos', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.changeColumn('robos', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex('robos', ['username'], { unique: true, name: 'robos_username_unique' });
    } catch (e) {}
  }
};
