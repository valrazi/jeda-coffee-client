'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'order_id', {
      type: Sequelize.STRING(15)
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'order_id')
  }
};
