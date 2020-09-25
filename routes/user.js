const express = require('express');

const route = new express.Router();

//controller imports
const usersController = require('../controllers/userController');

//get all users
route.get('/users', usersController.getAllUsers);

//user signup
route.post('/signup', usersController.signUpUser);

//user login
route.post('/login', usersController.loginUser);

module.exports = route;