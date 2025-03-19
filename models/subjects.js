const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Subject = sequelize.define('subjects', {
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    paranoid: true
})

module.exports = Subject