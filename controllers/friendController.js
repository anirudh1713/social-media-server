const Friend = require('../models/friend');
const User = require('../models/user');
const { Op } = require('sequelize');

//add friend
exports.addNewFriend = async (req, res, next) => {
  try {
    const { user } = req;
    const response = await Friend.findAll({ where: { requester_id: req.params.id, receiver_id: user.user_id } });
    if (response.length > 0) return res.status(400).send({ error: 'already exist' });
    await user.addRequester(req.params.id);
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}

//get all pending requests
exports.getAllPendingRequests = async (req, res, next) => {
  try {
    const { user } = req;
    const pendingRequests = await Friend.findAll({ where: { receiver_id: user.user_id, status: 'P' } });
    res.send({ pendingRequests });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}

//accept friend request
exports.acceptReq = async (req, res, next) => {
  try {
    const { user } = req;
    const reqToAccept = await Friend.findOne({
      where: {
        receiver_id: user.user_id,
        requester_id: req.params.reqId,
        status: 'P'
      }
    });
    if (!reqToAccept) return res.status(404).send({ error: 'not found' });
    reqToAccept.status = 'A';
    const result = await reqToAccept.save();
    res.send({ result });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}

//reject friend request
exports.rejectReq = async (req, res, next) => {
  try {
    const { user } = req;
    const reqToAccept = await Friend.findOne({
      where: {
        receiver_id: user.user_id,
        requester_id: req.params.reqId,
        status: 'P'
      }
    });
    if (!reqToAccept) return res.status(404).send({ error: 'not found' });
    reqToAccept.status = 'R';
    const rejected = await reqToAccept.save();
    res.send({ rejected });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}

//get friendlist
exports.getFriends = async (req, res, next) => {
  try{
    const { user } = req;
    const friendList = await Friend.findAll({
      where: {
        status: 'A',
        [Op.or]: [
          { requester_id: user.user_id },
          { receiver_id: user.user_id }
        ]
      }
    });
    res.send({ friends: friendList });
  } catch(e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}