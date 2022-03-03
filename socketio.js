const io = require("socket.io")();
const RoomSocket = require('./app/room_socket/model');
const socketapi = {};
socketapi.io = io
const rooms = {};

/**
 * 1. panggil controller
 * 2. nanti socket akan terus hidup dan manggil controller di halaman ini
 * 3. socket akan mengirimkan data ke halaman ini
 * 
 * kalo on itu nerima
 * kalo emit itu ngirim
 * 
 * search-room => ruang pencarian room
 * connect-to-room => memberi tau kalo ada player yang baru join
 * send-question =>
 */
let addUserToRooms = async (channel_code, language_name, player_id, socket_id) => {
    // let room_socket = new RoomSocket({ channel_code, language_name, player_id, socket_id });
    // await room_socket.save();
    var filter = {
        channel_code: channel_code
    }
    var doc = { 
        channel_code: channel_code,
        language_code: language_name, 
        player_id:[
            player_id
        ], 
        socket_id: socket_id }
    await RoomSocket.findOneAndUpdate(
        filter,
        doc,
        {upsert:true,new:true,runValidators});
    // console.log(`socket search-room ${channel_code}`);
}

let checkRoom = async(channel_code, language_code) =>{
    let room = await RoomSocket.findOne({channel_code:channel_code});
    if(!room){
        return false;
    }
    return true;
}

let deleteUserFromRoom = async (channel_code, language_name, player_id) =>{
    await RoomSocket.findOneAndRemove({
        channel_code:channel_code,
        language_code: language_name,
        player_id:player_id
    })
}


socketapi.io.on("connection", function (socket) {
    console.log('a user connected');

    socket.on('search-room',(channel_code, language_code, player_id )=>{
        try {
            socket.join(channel_code);
            console.log(`socket search-room ${channel_code}`);
            addUserToRooms(channel_code, language_code, player_id, socket.id);
            // rooms[language_name][channel_code][socket.id] = player_name;
            socket.to(channel_code).emit('connect-to-room', player_id)
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * channel_code => channel kode
     * language_code => kode bahasa
     * question => json pertanyaan satu soal
     */
    socket.on('send-question', (channel_code, language_name, player_name, question )=>{
        if (checkRoom(channel_code)){
            socket.to(channel_code).emit('broadcast-question', { question: question, language_name: language_name, player_name: player_name }, {status:true});
        }else{
            socket.to(channel_code).emit('broadcast-question', { question: question, language_name: language_name, player_name: player_name }, { status: false });

        }

    });

    socket.on('disconnect-room', (channel_code, language_name, player_id )=>{
        socket.to(channel_code).broadcast.emit('user-disconnected', player_id);
        deleteUserFromRoom(channel_code, language_name, player_id)
    })  
   
});






module.exports = {socketapi, rooms};