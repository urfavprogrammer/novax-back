"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Depending on how the unique was created, try both dropIndex and removeConstraint safely
    // 1) Drop an index named 'deposits_username_unique' if it exists
    try {
      await queryInterface.removeIndex('deposits', 'deposits_username_unique');
    } catch (e) {
      // ignore if not exists
    }
    // 2) Drop a generic index on username if exists
    try {
      await queryInterface.removeIndex('deposits', ['username']);
    } catch (e) {
      // ignore if not exists
    }
    // 3) Drop a named constraint if it exists (Postgres often names it like `${table}_${col}_key`)
    try {
      await queryInterface.removeConstraint('deposits', 'deposits_username_key');
    } catch (e) {
      // ignore if not exists
    }

    // Finally, ensure the column definition no longer has unique
    try {
      await queryInterface.changeColumn('deposits', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {
      // Some dialects may not support changeColumn for removing unique. That's okay if constraint is gone.
    }
  },

  async down(queryInterface, Sequelize) {
    // Recreate the unique constraint on deposits.username
    try {
      await queryInterface.changeColumn('deposits', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}

    // Add an explicit unique index for portability
    try {
      await queryInterface.addIndex('deposits', ['username'], {
        name: 'deposits_username_unique',
        unique: true,
      });
    } catch (e) {}
  },
};
