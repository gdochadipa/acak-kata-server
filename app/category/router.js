var express = require('express');
const {index,createdRoom, findRoom, findRoomAction, waitingRoom} = require('./controller');
var router = express.Router();

/* GET home page. */
router.get('/', index);

router.post('/create-room', createdRoom);

// /find-room
router.get('/find-room', findRoom);

// /find-room/action
router.post('/find-room/action',findRoomAction);

// waiting room
router.get('/waiting-room',waitingRoom);

module.exports = router;
