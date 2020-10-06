const express = require('express');
const multer = require('multer');

const auth = require('../middlewares/auth');
const postController = require('../controllers/postController');

const route = new express.Router();

const upload = new multer({
  limits: {
    fileSize: 1 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(undefined, false);
    }
    cb(undefined, true);
  }
});

//add post (ONLY AUTHENTICATED USER)
route.post('/post', auth, upload.single('post_image'), postController.addPost);

//delte post (ONLY AUTHENTICATED USER)
route.delete('/post/:id', auth, postController.deletePost);

//edit post
route.patch('/post/:id', auth, postController.editPost);

//get a post BY ID
route.get('/post/:id', postController.getPost);

//like a post BY POST ID
route.post('/post/like/:postId', auth, postController.likePost);

//dislike a post BY POST ID
route.post('/post/dislike/:postId', auth, postController.dislikePost);

//get all posts of a particular user by user ID
route.get('/post/user/:id', auth, postController.getAllPostsUser);

//TODO - RETURN POST FOR A PAGE (PAGINATION)
route.get('/posts', auth, postController.getAllPosts);

module.exports = route;