const sequelize = require('./index_pegasus')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Tenant = sequelize.define('tenants', {
    username: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
    },
    passId: {
        field: 'pass_id',
        type: DataTypes.STRING,
    },
    authId: {
        field: 'auth_id',
        type: DataTypes.STRING,
    },
    channelId: {
        field: 'channel_id',
        type: DataTypes.INTEGER,
    },
    radiusMeter: {
        field: 'radius_meter',
        type: DataTypes.INTEGER,
    },
    prefix: {
        type: DataTypes.STRING,
    },
    createdAt: {
        field: 'create_date',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    timestamps: false,
})

module.exports = Tenant