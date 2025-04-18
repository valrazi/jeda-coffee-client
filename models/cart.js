const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Customer = require('./customer')
const Cart = sequelize.define('carts', {
    id: {
        type: Sequelize.STRING,
        autoIncrement: true,
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
    total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    checkout_at: {
        type: Sequelize.DATE,
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

Customer.hasMany(Cart, {foreignKey: 'customer_id'})
Cart.belongsTo(Customer, {foreignKey: 'customer_id'})
module.exports = Cart