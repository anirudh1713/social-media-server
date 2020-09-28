const Post = require('../models/post');
const User = require('../models/user');
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
      const blob = bucket.file(`post_images/${user.user_id}_${Date.now()}`);
      const blobWriter = blob.createWriteStream({
        metadata: {
          ContentType: req.file.mimeType
        }
      });
      blobWriter.on('error', (e) => {
        throw new Error('could not upload image');
      });
      blobWriter.on('finish', () => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/post_images%2F%${encodeURI(bucket.name.split('/')[1])}?alt=media`;
        //add post to db
        if (description) {
          description = description.trim();
        }
        user.createPost({ description, picture: url }).then(response => {
          res.status(201).send(response);
        }).catch(err => {
          console.log(err);
          res.status(500).send({ error: err.message });
        });
      });
      blobWriter.end(req.file.buffer);
    } else {
      if (!req.body.description) res.status(400).send({ error: 'add image or description' });
      description = description.trim();
      const post = await user.createPost({ description });
      res.status(201).send(post);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
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
    const userId = post.userUserId;
    if (userId !== user.user_id) throw Error('invalid user');
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