var express = require('express');
var router = express.Router();
const { isLoginUsers } = require('../middleware/index');
const { profile } = require('./controller');
var {socketapi, rooms} = require('../../socketio')


router.get('/', isLoginUsers, profile);



module.exports = router;