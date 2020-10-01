const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');

const route = new express.Router();

//controller imports
const usersController = require('../controllers/userController');

//get all users
route.get('/users', usersController.getAllUsers);

//user signup
route.post('/signup', usersController.signUpUser);

//user login
route.post('/signin', usersController.loginUser);

//profile photo
const upload = new multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024
  },
  fileFilter: function(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('please upload image only'));
    }
    cb(undefined, true);
  }
});

//user add profileimage
route.patch('/user/profileimage', auth, upload.single('profileImage'), usersController.addProfileImage);

//get one user by id
route.get('/user/:id', auth, usersController.getUserData);

//logout user
route.post('/user/logout', auth, usersController.logoutUser);

module.exports = route;