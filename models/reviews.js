const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize');
const Customer = require('./customer');
const Order = require('./order');
const Review = sequelize.define('reviews', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    customer_id: DataTypes.STRING,
    order_id: DataTypes.STRING,
    rate: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: true
})

Review.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Review, { foreignKey: 'customer_id' })
Review.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Review, { foreignKey: 'order_id' })

module.exports = Review