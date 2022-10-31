var express = require('express');
var router = express.Router();
const {isLoginUsers} = require('../middleware/index');
const { createRoom, searchingRoomWithCode, confirmGame, getPackageQuestion, saveScoreMatch, getResultMatch, findRoomWithRoomCode, findRoomByID, testSchedule, onDisconnectRoom, disconnectFromRoom, getQuestionRelated} = require('./controller');
var socket = require('../../socketio')

router.post('/create-room', isLoginUsers,createRoom);
router.post('/search-code-room', isLoginUsers, searchingRoomWithCode);
router.post('/confirm-game', isLoginUsers, confirmGame);
router.post('/cancel-room', isLoginUsers, disconnectFromRoom);
router.get('/package-question', isLoginUsers, getPackageQuestion);
router.get('/package-question/related-word', isLoginUsers, getQuestionRelated);
router.post('/save-score', isLoginUsers, saveScoreMatch);
router.get('/result-match', isLoginUsers, getResultMatch);
router.get('/find-room', isLoginUsers, findRoomWithRoomCode);
router.get('/find-room-by-id',isLoginUsers,findRoomByID);

router.post('/test-schedule',testSchedule);



module.exports = router;