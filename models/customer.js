const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Customer = sequelize.define('customers', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    kota_asal: {
        type: Sequelize.STRING,
    },
    security_question: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    security_answer: {
        type: Sequelize.STRING,
        allowNull: false,
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

module.exports = Customer