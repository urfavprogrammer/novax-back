"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add transactionid to all investment-related tables
  const addTx = async (table) => {
      try {
        await queryInterface.addColumn(table, 'transactionid', {
          type: Sequelize.STRING(100),
      allowNull: true,
        });
      } catch (e) {
        // ignore if already exists
      }
    };

    await addTx('cryptos');
    await addTx('ctraders');
    await addTx('mortgages');
    await addTx('reits');
    await addTx('robos');
    await addTx('savings');
    await addTx('stakes');
    await addTx('stocks');
  },

  async down(queryInterface, Sequelize) {
    // Remove transactionid columns
    const dropTx = async (table) => {
      try {
        await queryInterface.removeColumn(table, 'transactionid');
      } catch (e) {
        // ignore if missing
      }
    };

    await dropTx('cryptos');
    await dropTx('ctraders');
    await dropTx('mortgages');
    await dropTx('reits');
    await dropTx('robos');
    await dropTx('savings');
    await dropTx('stakes');
    await dropTx('stocks');
  }
};
