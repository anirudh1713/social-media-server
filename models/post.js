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
        type: Sequelize.BLOB('long')
    },
    likes: {
        type: Sequelize.INTEGER
    },
    dislikes: {
        type: Sequelize.INTEGER
    }
});

module.exports = post;