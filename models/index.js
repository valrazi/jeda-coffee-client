const { Sequelize } = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  dialectModule: require('mysql2')
})

module.exports = sequelize