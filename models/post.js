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
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    },
    dislikes: {
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
});

module.exports = post;