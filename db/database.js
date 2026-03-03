const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/ticketing.sqlite',
  logging: false
});

module.exports = sequelize;
