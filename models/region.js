const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Region = sequelize.define('region', {
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'region',
    timestamps: false
})

module.exports = Region