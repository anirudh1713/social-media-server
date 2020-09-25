const Sequelize = require('sequelize');
const sequelize = require('../db/db');

const comment = sequelize.define('comment', {
    comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    //TODO - SHOULD NOT BE ALPHANUMERIC
    //TODO - LIKE DISLIKE DEFAULT VALUE TO 0
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            isAlphanumeric: true
        }
    },
    likes: {
        type:Sequelize.INTEGER
    },
    dislikes: {
        type: Sequelize.INTEGER
    }
});

module.exports = comment;