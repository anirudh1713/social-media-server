const Sequelize = require('sequelize');
const sequelize = require('../db/db');

const post = sequelize.define('post' , {
    post_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: Sequelize.TEXT
    },
    picture: {
        type: Sequelize.STRING
    },
    likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    dislikes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

module.exports = post;