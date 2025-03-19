const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.PEGASUS_DB,
  host: '127.0.0.1',
  username: process.env.PEGASUS_USERNAME,
  password: process.env.PEGASUS_PASSWORD,
  dialect: 'mysql',
  dialectModule: require('mysql2')
})

module.exports = sequelize