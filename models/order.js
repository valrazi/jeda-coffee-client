const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Customer = require('./customer')
const Orders = sequelize.define('orders', {
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
    table_number: {  // If customers order from tables via QR code
        type: Sequelize.STRING,
        allowNull: true
    },
    transfer_proof: {  // If customers order from tables via QR code
        type: Sequelize.TEXT,
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
    order_id: {
        type: Sequelize.STRING(15)
    },
    paid_at_cashier: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    },
}, {
    timestamps: true,
    paranoid: true
})

Customer.hasMany(Orders, {foreignKey: 'customer_id'})
Orders.belongsTo(Customer, {foreignKey: 'customer_id'})
module.exports = Orders