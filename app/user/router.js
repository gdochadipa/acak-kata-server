var express = require('express');
var router = express.Router();
const { isLoginUsers } = require('../middleware/index');
const { profile, editProfile } = require('./controller');
var {socketapi, rooms} = require('../../socketio');


router.get('/', isLoginUsers, profile);
router.post('/:userId', isLoginUsers, editProfile);


module.exports = router;