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
  
    await queryInterface.createTable("kyc", {

      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            username: { type: Sequelize.STRING(255), allowNull: false, unique: true },
            first: { type: Sequelize.STRING(255), allowNull: false },
            second: { type: Sequelize.STRING(255), allowNull: false },
            third: { type: Sequelize.STRING(255), allowNull: false },
            fourth: { type: Sequelize.STRING(255), allowNull: false },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },

    });
 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("kyc");
  }
};
