const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Subcategory = require('./subcategory')
const Product = sequelize.define('products', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subcategory_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    timestamps: false,
})

Subcategory.hasMany(Product, {foreignKey: 'subcategory_id'})
Product.belongsTo(Subcategory, {foreignKey: 'subcategory_id'})
module.exports = Product