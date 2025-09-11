"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Attempt to remove any existing indexes/constraints related to contacts.username
    try { await queryInterface.removeIndex('contacts', ['username']); } catch (e) {}
    try { await queryInterface.removeIndex('contacts', 'contacts_username_unique'); } catch (e) {}
    try { await queryInterface.removeConstraint('contacts', 'contacts_username_key'); } catch (e) {}

    // Change column to ensure unique: false
    try {
      await queryInterface.changeColumn('contacts', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Revert to unique true and recreate index
    try {
      await queryInterface.changeColumn('contacts', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex('contacts', ['username'], { unique: true, name: 'contacts_username_unique' });
    } catch (e) {}
  }
};
