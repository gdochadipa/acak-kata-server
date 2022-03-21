const io = require("socket.io")();
const RoomSocket = require('./app/room_socket/model');
const RoomMatch = require('./app/room_match/model');
const RoomMatchDetail = require('./app/room_match/model');
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
let addUserToRooms = async (channel_code, language_name, room_detail, socket_id) => {
    // let room_socket = new RoomSocket({ channel_code, language_name, player_id, socket_id });
    // await room_socket.save();
    var filter = {
        channel_code: channel_code
    }
    var doc = { 
        channel_code: channel_code,
        language_code: language_name, 
        player_id:[
            room_detail.player_id._id
        ], 
        socket_id: socket_id }
    await RoomSocket.findOneAndUpdate(
        filter,
        doc,
        {upsert:true,new:true});
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

let setPlayerReceiveQuestion = async(room_detail_id) =>{
    let roomDetail = await RoomMatchDetail.findOneAndUpdate({_id:room_detail_id},{is_ready:2});
}

/**
 * 
 * yg kurang socket
 * 1. buat alur socket untuk mastiin player lain selain host untuk sudah nerima masing-masing soal
 * 2. buat alut socket kalau pemain lain sudah ada yang mennyelesaikan permainan,
 *  kalau belum selesai pemain yg sudah selesai akan masuk ke ruang tunggu rekap
 * 
 * yg kurang fitur
 * 1. ngembangin fitur daily games
 * 2. fitur cancel game
 * 3. fitur ketika keluar permainan dapat balik
 * 4. encryp soal
 * 5. fitur login signup
 * 6. fitur update edit profile
 * 7. ngembagin animation pada flutter
 * 
 */
socketapi.io.on("connection", function (socket) {
    console.log('a user connected '+socket.id);
    
    // socket.emit('eventName',"{data:data}");

    socket.on('search-room',(data)=>{
        var parse = JSON.parse(data);

        //emit set room => room_detail
        socket.to(parse.channel_code).emit('set-room', JSON.stringify({ room_detail: parse.room_detail, target: 'update-player'}));
        addUserToRooms(parse.channel_code, parse.language_code, parse.room_detail, socket.id);
        // rooms[language_name][channel_code][socket.id] = player_name;
        // socket.emit('set-room', parse.player_id);
            
    });

    socket.on('join-room', function (data) {
        var parse = JSON.parse(data);
        console.log("join room "+parse.player_id);
        socket.join(parse.channel_code);
        socket.to(parse.channel_code).emit('eventName', "on connect");
    });

    socket.on("eventName", function (data) {
        var parse = JSON.parse(data);
        socket.to(parse.channel_code).emit('set-room-2', parse.player_id);
    });

    /**
     * channel_code => channel kode
     * language_code => kode bahasa
     * question => json pertanyaan satu soal
     */
    socket.on('send-question', (data)=>{
        var parse = JSON.parse(data);
        if (checkRoom(parse.channel_code)){
            socket.to(parse.channel_code).emit('broadcast-question', JSON.stringify({ question: parse.question, language_name: parse.language_code, player_id: parse.player_id, status: true }));
        }else{
            socket.to(parse.channel_code).emit('broadcast-question', JSON.stringify({ question: parse.question, language_name: parse.language_code, player_id: parse.player_id, status: false }));
        }

    });

    socket.on('status-player', (data) =>{
        console.log();
        var parse = JSON.parse(data); 
        socket.to(parse.channel_code).emit('broadcast-status-player', JSON.stringify({ room_detail_id: parse.room_detail_id, status: parse.is_ready, target: 'update-status' }));
    });

    socket.on('test',(data)=>{
        console.log(data);
    });

    /**
     * 1. channel_code
     * 2. language_code
     * 3. player_id
     */
    socket.on('player-receive-question',(data)=>{
        try {
            var parse = JSON.parse(data);
            setPlayerReceiveQuestion(data['room_detail_id']);
            socket.to(data.channel_code).emit('info-another-receive-question', { channel_code: parse.channel_code, room_id: parse.room_id});
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect-room', (data)=>{
        var parse = JSON.parse(data);
        socket.to(parse.channel_code).broadcast.emit('user-disconnected', parse.player_id);
        deleteUserFromRoom(parse.channel_code, parse.language_name, parse.player_id)
    })  
   
});






module.exports = {socketapi, rooms};