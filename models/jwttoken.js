const sequelize = require('../db/db');
const Sequelize = require('sequelize');

const Jwttoken = sequelize.define('jwttoken', {
  token_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  jwttoken: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Jwttoken;