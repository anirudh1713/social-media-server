const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { Storage } = require('@google-cloud/storage');

//add a post
exports.addPost = async (req, res, next) => {
  try {
    const { user } = req;
    let { description } = req.body;
    if (req.file) {
      const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT_ID,
        keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
      });
      const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL_PROFILE);
      const blob = bucket.file(`post_images/${user.user_id}_${Date.now()}_${req.file.originalname}`);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });
      blobWriter.on('error', (e) => {
        res.status(500).send({ error: e });
      });
      blobWriter.on('finish', () => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/post_images%2F${encodeURI(blob.name.split('/')[1])}?alt=media`;
        //add post to db
        if (description) {
          description = description.trim();
        }
        
        //CREATE POST AND RETURN WITH POST INCLUDING COMMENTS AND USER INFO
        user.createPost({ description, picture: url }).then(response => {
          return Post.findByPk(response.post_id, { include: [Comment, User] });
        }).then(postWithData => {
          res.status(201).send(postWithData);
        }).catch(err => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
      });
      blobWriter.end(req.file.buffer);
    }else {
      if (!req.body.description) return res.status(400).send({ error: 'add image or description' });
      description = description.trim();

      //CREATE POST AND RETURN WITH POST INCLUDING COMMENTS AND USER INFO
      const post = await user.createPost({ description });
      const postWithData = await Post.findByPk(post.post_id, { include: [Comment, User] });
      res.status(201).send(postWithData);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
};

//delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { user } = req;
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).send({ error: 'post not found' });
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

//like post
exports.likePost = async (req, res, next) => {
  try {
    const { user } = req;
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).send({ error: 'post not found' });
    if (post.likes.includes(user.user_id)){
      //return res.status(400).send({ error: 'already liked' });

      post.likes = post.likes.filter(id => {
        return id !== user.user_id;
      });
      const updatedPost = await post.save();
      return res.send({ post: updatedPost });
    } 
    if (post.dislikes.includes(user.user_id)) {
      post.dislikes = post.dislikes.filter(id => {
        return id !== user.user_id;
      });
    }
    post.likes = [...post.likes, user.user_id];
    const updatedPost = await post.save();
    res.send({ post: updatedPost })
  }catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//dislike a post
exports.dislikePost = async (req, res, next) => {
  try {
    const { user } = req;
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).send({ error: 'post not found' });
    if (post.dislikes.includes(user.user_id)){
      //return res.status(400).send({ error: 'already disliked' });

      post.dislikes = post.dislikes.filter(id => {
        return id !== user.user_id;
      });
      const updatedPost = await post.save();
      return res.send({ post: updatedPost });
    }
    if (post.likes.includes(user.user_id)) {
      post.likes = post.likes.filter(id => {
        return id !== user.user_id;
      });
    }
    post.dislikes = [...post.dislikes, user.user_id];
    const updatedPost = await post.save();
    res.send({ post: updatedPost });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//get posts of a particular user
exports.getAllPostsUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) res.status(404).send({ error: 'user not found' });
    const posts = await user.getPosts();
    res.send({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

//get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({ include: { all: true, nested: true } });
    if (!posts) res.status(404).send({ error: 'posts not found' });
    res.send({ posts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};