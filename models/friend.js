const Sequelize = require('sequelize');
const sequelize = require('../db/db');
const User = require('./user');

const friend = sequelize.define('friend', {
  // user_one_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: User,
  //     key: 'user_id'
  //   }
  // },
  // user_two_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: User,
  //     key: 'user_id'
  //   }
  // },
  status: {
    type: Sequelize.STRING(1),
    allowNull: false,
    defaultValue: 'P',
    validate: {
      is: /P|A|R|B/i
    }
  }
}, {
  indexes: [
    {
      primaryKey: true,
      fields: ['requester_id', 'receiver_id']
    }
  ]
});

module.exports = friend;