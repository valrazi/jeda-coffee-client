const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Subcategory = sequelize.define('subcategory', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'subcategory'
})

module.exports = Subcategory