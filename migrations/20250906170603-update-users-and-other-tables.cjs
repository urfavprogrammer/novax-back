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

    // await queryInterface.addColumn("users", "kyc_upload", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });

    await queryInterface.changeColumn("cryptos", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  await queryInterface.changeColumn("ctraders", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  await queryInterface.changeColumn("mortgages", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("reits", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("robos", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
      await queryInterface.changeColumn("savings", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
      await queryInterface.changeColumn("stocks", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("referrals", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("contacts", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("stakes", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  // kyc_upload column removal skipped: column may pre-exist, so this migration does not remove it.

     
    await queryInterface.changeColumn("cryptos", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("ctraders", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("mortgages", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("reits", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("robos", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("savings", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("stocks", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("referrals", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("contacts", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("stakes", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });



  }
};
