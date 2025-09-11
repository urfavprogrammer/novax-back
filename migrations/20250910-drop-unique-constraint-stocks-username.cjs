"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Attempt to remove any unique index/constraint remnants on stocks.username
    try { await queryInterface.removeIndex("stocks", ["username"]); } catch (e) {}
    try { await queryInterface.removeIndex("stocks", "stocks_username_unique"); } catch (e) {}
    try { await queryInterface.removeConstraint("stocks", "stocks_username_key"); } catch (e) {}

    // Ensure column is defined without unique
    try {
      await queryInterface.changeColumn("stocks", "username", {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: false,
      });
    } catch (e) {}
  },

  async down(queryInterface, Sequelize) {
    // Re-add unique constraint if rolling back
    try {
      await queryInterface.changeColumn("stocks", "username", {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      });
    } catch (e) {}
    try {
      await queryInterface.addIndex("stocks", ["username"], { unique: true, name: "stocks_username_unique" });
    } catch (e) {}
  },
};
