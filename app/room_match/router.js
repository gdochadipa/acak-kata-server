var express = require('express');
var router = express.Router();
const {isLoginUser} = require('../middleware/auth');
const {createRoom} = require('./controller');
var socket = require('../../socketio')

router.post('/create-room',isLoginUser,createRoom);



module.exports = router;