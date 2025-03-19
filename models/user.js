const sequelize = require('./index')
const { DataTypes } = require('sequelize')
const User = sequelize.define('users', {
  id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      allowNull: false,
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  department: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  vendor: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  level: {
      type: DataTypes.ENUM('user', 'admin', 'operator')
  },
  status: {
      type: DataTypes.ENUM('active', 'inactive')
  }
}, {
  timestamps: false
})

module.exports = User