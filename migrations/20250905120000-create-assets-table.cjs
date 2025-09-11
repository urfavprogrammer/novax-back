"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assets", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      total_balance: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      profit: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      trade_bonus: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      referal_bonus: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      total_won: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      total_loss: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      total_deposit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_withdrawal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_pendingdeposit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_pendingwithdrawal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      investment_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      investment_plan: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      countingDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      investment_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      investment_date: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("assets");
  },
};
