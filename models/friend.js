const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const User = require('./user');

const friend = sequelize.define('friend', {
  status: {
    type: Sequelize.STRING(1),
    allowNull: false,
    defaultValue: 'P',
    validate: {
      is: /P|A|R|B/i
    }
  }
});

module.exports = friend;