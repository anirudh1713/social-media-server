const Post = require('../models/post');
const User = require('../models/user');

//add a post
exports.addPost = async (req, res, next) => {
  try {
    const { user, token } = req;
    const { description, picture } = req.body;
    //add post to db
    const post = await user.createPost({ description, picture });
    res.status(201).send({ post });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

//delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { user } = req;
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    const userId = post.userUserId;
    if (userId !== user.user_id) throw Error('invalid user');
    await Post.destroy({ where: { post_id: postId } });
    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

//edit post
exports.editPost = async (req, res, next) => {
  //TODO - VALIDATION
  try {
    const { user } = req;
    let { description } = req.body;
    description = description.trim();
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) res.status(404).send({ error: 'post not found' });
    const userId = post.userUserId;
    if (userId !== user.user_id) res.status(401).send({ error: 'invalid user' });
    const updatedPost = await Post.update({ description } ,{ where: { post_id: postId } });
    res.send({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

//get a post (GET BY ID)
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) res.status(404).send({ error: 'post not found' });
    res.send({ post });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};