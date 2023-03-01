var express = require('express');
var { socketapi, rooms} = require('../../socketio');
const {index,createdRoom, findRoom, findRoomAction, waitingRoom, playRoom} = require('./controller');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>{
   
    res.status(200).json({ data: "success", status: true });

});

// /* GET home page. */
// router.get('/admin', async (req, res) => {

//     res.render('index',{title:'Admin',name:'Admin'});    

// });



module.exports = router;
