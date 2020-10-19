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
function uploadFile(req, res, next) {
  const upload = multer({
    limits: {
      fileSize: 1 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
      if(!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
        cb('upload image only.', false);
      }
      cb(undefined, true);
    }
  }).single('profileImage');

  upload(req, res, function (err) {
    console.log(`\n\n\n ${err} \n\n\n`);
    if (err instanceof multer.MulterError) {
      return res.status(400).send({error: err});
    } else if (err) {
      return res.status(400).send({ error: err });
    }
    next();
  })
}

//user add profileimage
route.patch('/user/profileimage', auth, uploadFile, usersController.addProfileImage);

//logout user
route.post('/user/logout', auth, usersController.logoutUser);

//search user
route.get('/search', auth, usersController.searchUser);

//update user data
route.patch('/user/data', auth, usersController.updateUserData);

//update user password
route.patch('/user/password', auth, usersController.updateUserPassword);

//get one user by id
route.get('/user/:id', auth, usersController.getUserData);

module.exports = route;