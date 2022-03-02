var {socket,rooms} = require('../../socketio');
var RoomSocket = require('./../room_socket/model');

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports={
    index:async(req,res)=>{
        // try {
        //     var data = await RoomSocket.find();
        //     data.forEach((room, key)=>{
        //         console.log('Index: ' + key + ' Value: ' +  room);
        //     })
        //     res.render('index', { title: 'Express', rooms: data });
        // } catch (error) {
        //     console.log(error);
        // }
    },
    createdRoom:async(req, res)=>{
        // try {
        //     console.log(req.body.room);
        //     roomID = makeid(5);
        //     let room = await RoomSocket({ channel_code: req.body.room, language_code: "b-indo" });
        //     await room.save();
        //     // var data = await RoomSocket.find();

            
        //     // res.render('index', { title: 'Express', rooms: data });
        // } catch (error) {
        //     console.log('===============socket===================');
        //     console.log(error);
        //     console.log('================socket==================');
        // }
    },
    waitingRoom:async(req, res)=>{
        try {
            
        } catch (error) {
            
        }
    },
    findRoom: async (req, res) => {
        try {
            RoomSocket.find();
            socket.io.emit('waiting-room', roomID);
        } catch (error) {
            console.log('===============socket===================');
            console.log(error);
            console.log('================socket==================');
        }
    },
    findRoomAction: async (req, res) => {
        try {
            if (rooms[req.body.room] != null){
                return res.redirect('index', {title:'gagal nyari room'});
            }

            rooms[req.body.room]['indo']={ users:{} }

            res.redirect(req.body.room);

            socket.io.emit('room-created', roomID);

        } catch (error) {

        }
    },
    playRoom: async(req, res) =>{
        try {
            
        } catch (error) {
            
        }
    }
}