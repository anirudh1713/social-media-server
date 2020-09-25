const express = require('express');
const commentController = require('../controllers/commentController');

const auth = require('../middlewares/auth');

const route = new express.Router();

//add comment (using postid) AUTH ONLY
route.post('/comment/:id', auth, commentController.addComment);

//delete comment (using commentid) AUTH ONLY
route.delete('/comment/:id', auth, commentController.deleteComment);

module.exports = route;