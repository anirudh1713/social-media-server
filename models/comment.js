const Sequelize = require('sequelize');
const sequelize = require('../db/db');

const comment = sequelize.define('comment', {
    comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    likes: {
        type:Sequelize.ARRAY(Sequelize.INTEGER)
    },
    dislikes: {
        type:Sequelize.ARRAY(Sequelize.INTEGER),
    }
});

module.exports = comment;