"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("funding_events", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING(100), allowNull: false },
      source_type: { type: Sequelize.STRING(100), allowNull: false },
      source_id: { type: Sequelize.STRING(100), allowNull: true },
      deposit_id: { type: Sequelize.INTEGER, allowNull: true },
      amount: { type: Sequelize.DECIMAL, allowNull: false, defaultValue: 0 },
      method: { type: Sequelize.STRING(100), allowNull: true },
      currency: { type: Sequelize.STRING(100), allowNull: true },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'pending' },
      memo: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSONB || Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('funding_events', ['username']);
    await queryInterface.addIndex('funding_events', ['source_type', 'source_id']);
    await queryInterface.addIndex('funding_events', ['deposit_id']);
    await queryInterface.addIndex('funding_events', ['status']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("funding_events");
  },
};
