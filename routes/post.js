const express = require('express');
const auth = require('../middlewares/auth');
const postController = require('../controllers/postController');

const route = new express.Router();

//add post (ONLY AUTHENTICATED USER)
route.post('/post', auth, postController.addPost);

//delte post (ONLY AUTHENTICATED USER)
route.delete('/post/:id', auth, postController.deletePost);

//edit post
route.patch('/post/:id', auth, postController.editPost);

//get a post BY ID
route.get('/post/:id', postController.getPost);

//TODO - RETURN POST FOR A PAGE (PAGINATION)

module.exports = route;