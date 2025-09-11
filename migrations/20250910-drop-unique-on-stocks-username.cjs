'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Drop unique constraint on stocks.username (by altering column without unique)
    await queryInterface.changeColumn('stocks', 'username', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Re-add unique constraint if rolled back
    await queryInterface.changeColumn('stocks', 'username', {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    });
  }
};
