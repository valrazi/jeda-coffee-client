const { Sequelize } = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize({
  database: process.env.TICKETING_DB,
  host: process.env.TICKETING_HOST,
  username: process.env.TICKETING_USERNAME,
  password: process.env.TICKETING_PASSWORD,
  dialect: 'mysql',
  dialectModule: require('mysql2')
})

module.exports = sequelize