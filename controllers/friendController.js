const Friend = require('../models/friend');
const User = require('../models/user');
const { Op } = require('sequelize');

//add friend
exports.addNewFriend = async (req, res, next) => {
  try {
    const { user } = req;
    if (req.params.id == user.user_id) return res.status(400).send({ error: 'can not self friend' });
    const response = await Friend.findOne({
      where: {
        userUserId: req.params.id, 
        receiverUserId: user.user_id
      }
    });
    if(!response) {
      const request = await user.addReceiver(req.params.id);
      return res.status(201).send({ request });
    }else{
      return res.status(400).send({ error: 'already exist' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//get all pending requests
exports.getAllPendingRequests = async (req, res, next) => {
  try {
    const { user } = req;
    const pendingRequests = await Friend.findAll({ where: { receiverUserId: user.user_id, status: 'P' }, include: { all: true } });
    if (!pendingRequests) res.status(404).send({ error: 'No pending requests' });
    res.send({ pendingRequests });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

exports.getAllSentRequest = async (req, res, next) => {
  try {
    const { user } = req;
    const sentRequest = await Friend.findAll({ where: { userUserId: user.user_id, status: 'P' }, include: { all: true } });
    if (!sentRequest) res.status(404).send({ error: 'no requests found' });
    res.send({ sentRequest });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//accept friend request
exports.acceptReq = async (req, res, next) => {
  try {
    const { user } = req;
    const reqToAccept = await Friend.findOne({
      where: {
        receiverUserId: user.user_id,
        userUserId: req.params.reqId,
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
};

//reject friend request
exports.rejectReq = async (req, res, next) => {
  try {
    const { user } = req;
    const reqToAccept = await Friend.findOne({
      where: {
        receiverUserId: user.user_id,
        userUserId: req.params.reqId,
        status: 'P'
      }
    });
    if (!reqToAccept) return res.status(404).send({ error: 'not found' });
    const rejected = await reqToAccept.destroy();
    res.send({ rejected });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//get friendlist
exports.getFriends = async (req, res, next) => {
  try{
    const { user } = req;
    const friendList = await Friend.findAll({
      where: {
        status: 'A',
        [Op.or]: [
          { userUserId: user.user_id },
          { receiverUserId: user.user_id }
        ]
      },
      include: { all: true }
    });
    res.send({ friends: friendList });
  } catch(e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
};

//remove friend
exports.removeFriend = async (req, res, next) => {
  try {
    const { user } = req;
    const friendShip = await Friend.findOne({
      where: {
        status: 'A',
        [Op.or]: [
          { userUserId: user.user_id, receiverUserId: req.params.id },
          { userUserId: req.params.id, receiverUserId: user.user_id }
        ]
      }
    });
    console.log(friendShip);
    if(!friendShip) return res.status(404).send({ error: 'not found' });
    const remove = await friendShip.destroy();
    res.send({ remove });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
}