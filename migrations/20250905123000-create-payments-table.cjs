"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
        payment_id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            btc: { type: Sequelize.STRING(100), allowNull: true },
            eth: { type: Sequelize.STRING(100), allowNull: true },
            usdt_erc20: { type: Sequelize.STRING(100), allowNull: true },
            usdt_trc20: { type: Sequelize.STRING(100), allowNull: true },
            ada: { type: Sequelize.STRING(100), allowNull: true },
            account_name: { type: Sequelize.STRING(100), allowNull: true },
            account_number: { type: Sequelize.STRING(100), allowNull: true },
            bank_name: { type: Sequelize.STRING(100), allowNull: true },
            account_type: { type: Sequelize.STRING(100), allowNull: true },
            routing_number: { type: Sequelize.STRING(100), allowNull: true },
            swift_code: { type: Sequelize.STRING(100), allowNull: true },
            bank_address: { type: Sequelize.STRING(200), allowNull: true },
            beneficiary_address: { type: Sequelize.STRING(200), allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
