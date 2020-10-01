const Sequelize = require('sequelize');
const sequelize = require('../db/db');

const user = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    gender: {
        type: Sequelize.STRING(1),
        validate: {
            is: /M|F|O/i
        }
    },
    dob: {
        type: Sequelize.DATE
    },
    profile_photo: {
        type: Sequelize.STRING
    }
});

module.exports = user;