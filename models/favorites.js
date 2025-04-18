const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize');
const Customer = require('./customer');
const Product = require('./product');
const Favorite = sequelize.define('favorites', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    customer_id: DataTypes.STRING,
    product_id: DataTypes.STRING,
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

Favorite.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Favorite, { foreignKey: 'customer_id' })
Favorite.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Favorite, { foreignKey: 'product_id' })

module.exports = Favorite