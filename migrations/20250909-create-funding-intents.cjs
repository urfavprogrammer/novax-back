"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("funding_intents", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false },
      source: { type: Sequelize.STRING(100), allowNull: false },
      entityId: { type: Sequelize.STRING(100), allowNull: true },
      amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      currency: { type: Sequelize.STRING(50), allowNull: true },
      method: { type: Sequelize.STRING(50), allowNull: true },
      memo: { type: Sequelize.TEXT, allowNull: true },
      channel: { type: Sequelize.STRING(50), allowNull: true },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'pending' },
      txid: { type: Sequelize.STRING(100), allowNull: true },
      metadata: { type: Sequelize.JSONB || Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex("funding_intents", ["username"]);
    await queryInterface.addIndex("funding_intents", ["source", "entityId"]);
    await queryInterface.addIndex("funding_intents", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("funding_intents");
  },
};
