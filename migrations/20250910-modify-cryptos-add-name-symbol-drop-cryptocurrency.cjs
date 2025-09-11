"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove unique constraint / index on username if it exists
    try { await queryInterface.removeIndex('cryptos', ['username']); } catch (e) {}
    try { await queryInterface.removeIndex('cryptos', 'cryptos_username_unique'); } catch (e) {}
    try { await queryInterface.removeConstraint('cryptos', 'cryptos_username_key'); } catch (e) {}

    // 2. Drop old 'cryptocurrency' column if it still exists
    // Checking existence indirectly isn't straightforward; attempt and ignore failure
    try { await queryInterface.removeColumn('cryptos', 'cryptocurrency'); } catch (e) {}

    // 3. Add new columns if they don't already exist
    // Sequelize CLI lacks a built-in conditional add; attempt add and swallow duplicate errors
    try { await queryInterface.addColumn('cryptos', 'crypto_name', { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'Unknown' }); } catch (e) {}
    try { await queryInterface.addColumn('cryptos', 'crypto_symbol', { type: Sequelize.STRING(50), allowNull: true }); } catch (e) {}

    // 4. Ensure username column is non-unique now
    try {
      await queryInterface.changeColumn('cryptos', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Revert: remove new columns, re-add old cryptocurrency and unique constraint
    try { await queryInterface.removeColumn('cryptos', 'crypto_name'); } catch (e) {}
    try { await queryInterface.removeColumn('cryptos', 'crypto_symbol'); } catch (e) {}
    try { await queryInterface.addColumn('cryptos', 'cryptocurrency', { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'Unknown' }); } catch (e) {}
    try {
      await queryInterface.changeColumn('cryptos', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
  }
};
