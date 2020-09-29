const express = require('express');
const auth = require('../middlewares/auth');
const friendController = require('../controllers/friendController');

const route = new express.Router();

//add friend
route.post('/friends/add/:id', auth, friendController.addNewFriend);

//get all pending requests
route.get('/friends/pending', auth, friendController.getAllPendingRequests);

//accept request (using REQUESTER_ID)
route.post('/friends/accept/:reqId', auth, friendController.acceptReq);

//reject request (using REQUESTER_ID)
route.post('/friends/reject/:reqId', auth, friendController.rejectReq);

//get all friends
route.get('/friends', auth, friendController.getFriends);

module.exports = route;