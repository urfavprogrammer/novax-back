"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contacts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      subject: { type: Sequelize.STRING(150), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("cryptos", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      cryptocurrency: { type: Sequelize.STRING(100), allowNull: false },
      rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      crypto_status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Pending' },
      date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("ctraders", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            trader_name: { type: Sequelize.STRING(100), allowNull: false },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'pending' },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("deposits", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            depositmethod: { type: Sequelize.STRING(100), allowNull: false },
            depositdate: { type: Sequelize.STRING(100), allowNull: false },
            depositstatus: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: "pending",
            },
            deposittransactionid: { type: Sequelize.STRING(100), allowNull: false },
            filePath: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("mortgages", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            property_name: { type: Sequelize.STRING(100), allowNull: false },
            property_image: { type: Sequelize.STRING(255), allowNull: true },
            property_description: { type: Sequelize.TEXT, allowNull: true },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("referrals", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
       username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            referral_name: { type: Sequelize.STRING(100), allowNull: false },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            bonus_earned: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("reits", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
       username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            property_name: { type: Sequelize.STRING(100), allowNull: false },
            property_image: { type: Sequelize.STRING(255), allowNull: true },
            property_description: { type: Sequelize.TEXT, allowNull: true },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("robos", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true  },
        username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            robo_name: { type: Sequelize.STRING(100), allowNull: false },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("savings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
       username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            savings_name: { type: Sequelize.STRING(100), allowNull: false },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("stakes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(100), allowNull: false , unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            stake_name: { type: Sequelize.STRING(100), allowNull: false },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("stocks", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            stock_name: { type: Sequelize.STRING(100), allowNull: false },
            stock_type: { type: Sequelize.STRING(50), allowNull: true },
            rate: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            profit: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.createTable("withdraws", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            trade_id: { type: Sequelize.STRING(200), allowNull: false },
            amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
            trade_name: { type: Sequelize.STRING(100), allowNull: false },
            wallet: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 0 },
            address: { type: Sequelize.STRING, allowNull: false },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: "pending",
            },
            date: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contacts");
    await queryInterface.dropTable("cryptos");
    await queryInterface.dropTable("ctraders");
    await queryInterface.dropTable("deposits");
    await queryInterface.dropTable("mortgages");
    await queryInterface.dropTable("referrals");
    await queryInterface.dropTable("reits");
    await queryInterface.dropTable("robos");
    await queryInterface.dropTable("savings");
    await queryInterface.dropTable("stakes");
    await queryInterface.dropTable("stocks");
    await queryInterface.dropTable("withdraws");
  },
};
