'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      table_number: {  
        type: Sequelize.STRING,
        allowNull: true
      },
      transfer_proof: {  
        type: Sequelize.STRING,
        allowNull: true
      },
      total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      order_status: {
        type: Sequelize.ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'card', 'qris'), // QRIS for digital payments
        allowNull: false
      },
      checkout_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders')
  }
};
