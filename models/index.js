const { Sequelize } = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize({
  database: process.env.TICKETING_DB,
  host: '127.0.0.1',
  username: process.env.TICKETING_USERNAME,
  password: process.env.TICKETING_PASSWORD,
  dialect: 'mysql',
  dialectModule: require('mysql2')
})

module.exports = sequelize