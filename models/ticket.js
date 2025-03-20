const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Ticket = sequelize.define('tickets', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ticket_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    amt_ticket_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    subject: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    detail: {
        type: DataTypes.TEXT,
    },
    department: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
    subcategory: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('open','on progress','done progress','assigned','pending','closed','cancel','resolve','re-assign','return'),
        defaultValue: 'open'
    },
    vendor: {
        type: DataTypes.STRING,
    },
    severity: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    partner: {
        type: DataTypes.STRING(20),
    },
    closed_code: {
        type: DataTypes.STRING,
    },
    billing_ioh: {
        type: DataTypes.STRING(50),
    },
    created_at: {
        type: DataTypes.DATE,
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
    created_by: {
        type: DataTypes.STRING,
    }
}, {
})

module.exports = Ticket