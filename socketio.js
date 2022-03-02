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
addUserToRooms = async (channel_code, language_name, player_id, socket_id) => {
    let room_socket = new RoomSocket({ channel_code, language_name, player_id, socket_id });
    await room_socket.save();
}

deleteUserFromRoom = async (channel_code, language_name, player_id) =>{
    await RoomSocket.findOneAndRemove({
        channel_code:channel_code,
        language_code: language_name,
        player_id:player_id
    })
}


socketapi.io.on("connection", function (socket) {
    socket.on('search-room',(channel_code, language_code, player_id )=>{
        socket.join(channel_code);
        const socket_id = socket.id;
        addUserToRooms(channel_code, language_code, player_id, socket_id);
        // rooms[language_name][channel_code][socket.id] = player_name;
        socket.to(channel_code).broadcast.emit('connect-to-room',player_name)
    });

    socket.on('send-question', (channel_code, language_name, player_name, question )=>{
        socket.to(channel_code).broadcast.emit('broadcast-question', {question:question, language_name:language_name, player_name:player_name});

    });

    socket.on('disconnect-room', (channel_code, language_name, player_id )=>{
        socket.to(channel_code).broadcast.emit('user-disconnected', player_id);
        deleteUserFromRoom(channel_code, language_name, player_id)
    })  
   
});






module.exports = {socketapi, rooms};