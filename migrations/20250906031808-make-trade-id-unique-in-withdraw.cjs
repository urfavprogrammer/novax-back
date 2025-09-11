'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn("withdraws", "trade_id", {
      type: Sequelize.STRING, // or your desired type
      unique: true,
      allowNull: false, // or true if you want to allow nulls
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('withdraws', 'trade_id', {
      type: Sequelize.STRING, // or previous type
      unique: false,
      allowNull: true, // or previous nullability
    });
  }
};
