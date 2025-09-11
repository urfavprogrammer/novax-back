"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatarUrl', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: '/uploads/avatars/default.png',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatarUrl');
  },
};
