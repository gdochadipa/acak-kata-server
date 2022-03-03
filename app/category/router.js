var express = require('express');
var { socketapi, rooms} = require('../../socketio');
const {index,createdRoom, findRoom, findRoomAction, waitingRoom, playRoom} = require('./controller');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>{
   
    res.render('index', { title: 'Express'});

});



module.exports = router;
