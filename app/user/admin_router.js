var express = require('express');
var router = express.Router();
var { socketapi, rooms } = require('../../socketio');
const { viewSignin, actionSignin, actionLogout } = require('./admin_controller');


router.get('/', viewSignin);
router.post('/', actionSignin);
router.get('/logout', actionLogout);


module.exports = router;