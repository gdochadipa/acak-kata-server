var express = require('express');
var router = express.Router();
const {isLoginUsers} = require('../middleware/index');
const {createRoom} = require('./controller');
var socket = require('../../socketio')

router.post('/create-room', isLoginUsers,createRoom);



module.exports = router;