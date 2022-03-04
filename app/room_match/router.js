var express = require('express');
var router = express.Router();
const {isLoginUsers} = require('../middleware/index');
const { createRoom, searchingRoomWithCode, confirmGame, cancelGameFromRoom, getPackageQuestion, saveScoreMatch, getResultMatch} = require('./controller');
var socket = require('../../socketio')

router.post('/create-room', isLoginUsers,createRoom);
router.post('/search-code-room', isLoginUsers, searchingRoomWithCode);
router.post('/confirm-game', isLoginUsers, confirmGame);
router.post('/cancel-room', isLoginUsers, cancelGameFromRoom);
router.get('/package-question', isLoginUsers, getPackageQuestion);
router.post('/save-score', isLoginUsers, saveScoreMatch);
router.get('/result-match', isLoginUsers, getResultMatch);



module.exports = router;