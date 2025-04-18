const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
const Cart = require('./cart')
const Product = require('./product')
const CartItem = sequelize.define('cart_items', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      cart_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        }
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
      },
      total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
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

Cart.hasMany(CartItem, {foreignKey: 'cart_id'})
CartItem.belongsTo(Cart, {foreignKey: 'cart_id'})

Product.hasMany(CartItem, {foreignKey: 'product_id'})
CartItem.belongsTo(Product, {foreignKey: 'product_id'})

module.exports = CartItem