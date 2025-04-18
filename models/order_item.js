const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Order = require('./order')
const Product = require('./product')
const OrderItem = sequelize.define('order_items', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    note: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
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
}, {
    timestamps: true,
    paranoid: true
})

Order.hasMany(OrderItem, {foreignKey: 'order_id'})
OrderItem.belongsTo(Order, {foreignKey: 'order_id'})

Product.hasMany(OrderItem, {foreignKey: 'product_id'})
OrderItem.belongsTo(Product, {foreignKey: 'product_id'})

module.exports = OrderItem