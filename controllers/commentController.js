const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

//add comment AUTH ONLY
exports.addComment = async (req, res, next) => {
  try {
    const { user } = req;
    let { description } = req.body;
    description = description.trim();
    const post = await Post.findByPk(req.params.id);
    if (!post) res.status(404).send({ error: 'post not found' });
    const comment = await user.createComment({ description, postPostId: req.params.id });
    res.status(201).send({ comment });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//delete comment (USING COMMENT ID)
exports.deleteComment = async (req, res, next) => {
  try {
    const { user } = req;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) res.status(404).send({ error: 'comment not found' });
    if (comment.userUserId !== user.user_id) res.status(401).send({ error: 'not authorized' });
    await Comment.destroy({ where: { comment_id: comment.comment_id } });
    res.send();
  } catch(e) {
    console.log(e);
    res.status(500).send({ error: e.message })
  }
};

//edit/update comment (USING COMMENT ID)
exports.editComment = async (req, res, next) => {
  try {
    const { user } = req;
    const { description } = req.body;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) res.status(404).send({ error: 'comment not found' });
    if (comment.userUserId !== user.user_id) res.status(401).send({ error: 'unauthorized' });
    await Comment.update({ description }, { where: { comment_id: comment.comment_id } });
    res.send();
  } catch(e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};