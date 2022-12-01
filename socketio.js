const io = require("socket.io")();
const RoomSocket = require('./app/room_socket/model');
const RoomMatch = require('./app/room_match/model');
const RoomMatchDetail = require('./app/room_match_detail/model');
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
            room_detail.player_id
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

let updateStatusPlayer = async (room_detail_id, status_player, is_ready, score) => {
    // console.log("on id => " + room_detail_id);
    let roomMatchDetail = await RoomMatchDetail.findOneAndUpdate({ _id: room_detail_id }, { is_ready: is_ready, status_player: status_player, score: score });
    // console.log("on update => " + roomMatchDetail);
}

let updateSocketIdPlayer = async (room_detail_id, socket_id) =>{
    await RoomMatchDetail.findOneAndUpdate({ _id: room_detail_id }, { socket_id: socket_id });
}

let changeHost = async(room_id, player_id_disconnect)=>{
    try {
        let roomMatch = await RoomMatch.findOne({ _id: room_id }).populate('room_match_detail');
        if (roomMatch.room_match_detail.length > 0) {
            let withoutHost = roomMatch.room_match_detail.filter((item) => {
                return item._id != player_id_disconnect
            });

            if (withoutHost.length > 0) {
                await RoomMatchDetail.findByIdAndUpdate({ _id: withoutHost[0]._id }, { is_host: 1 });
                await RoomMatchDetail.findByIdAndUpdate({ _id: player_id_disconnect }, { is_host: 0 });

                socket.to(roomMatch.channel_code).emit('change-host', JSON.stringify({ id_host_before: player_id_disconnect, id_host_after: withoutHost[0]._id, target: 'change_host' }));
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}

let deletePlayerIfDisconnect = async (socket_id, socket) => {
    //0 is not ready
    let roomPlayer = await RoomMatchDetail.find({ socket_id: socket_id, status_player: {$in:[0,1]} }).populate('room_id');

    if (roomPlayer.length > 0) {

        let detail = roomPlayer[0];

        // if host room is disconnect, room game will failed created and every people will exit from room
        if (detail.is_host == 1){
            socket.to(detail.room_id.channel_code).emit('host-exit-room', JSON.stringify({ channel_code: detail.room_id.channel_code, player_id: detail.player_id, target: 'host-exit-room' }));
        }
        await RoomMatchDetail.findByIdAndRemove({ _id: detail._id});
        socket.to(detail.room_id.channel_code).emit('user-disconnected', JSON.stringify({ channel_code: detail.room_id.channel_code, player_id: detail.player_id, target: 'user-disconnected' }));

    }
    
}

let updateStatusGame = async (room_id, status_game) => {
    // console.log("on id => " + room_id);
    let roomMatch =  await RoomMatch.findOneAndUpdate({ _id: room_id }, { status_game: status_game });
    // console.log("on update => " + roomMatch);
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
        console.log("search room " + parse.room_detail);
        //emit set room => room_detail
        socket.to(parse.channel_code).emit('set-room', JSON.stringify({ room_detail: parse.room_detail, target: 'update-player'}));
        addUserToRooms(parse.channel_code, parse.language_code, parse.room_detail, socket.id);
        // rooms[language_name][channel_code][socket.id] = player_name;
        // socket.emit('set-room', parse.player_id);
            
    });
    // untuk join room (lakukan sebelum jalanin socket lain)
    socket.on('join-room', function (data) {
        var parse = JSON.parse(data);
        console.log("join room "+data);
        socket.join(parse.channel_code);
        updateSocketIdPlayer(parse.room_detail_id, socket.id);
        // socket.to(parse.channel_code).emit('eventName', JSON.stringify({ data: 'onTes' }));
    });

    socket.on("onTest", function (data) {
        var parse = JSON.parse(data);
        console.log("on Test " + data);
        // socket.to(parse.channel_code).emit('eventName', "on test");
        socket.emit('eventName', "on test");
    });

    /**
     * channel_code => channel kode
     * language_code => kode bahasa
     * question => json pertanyaan satu soal
     */
    socket.on('send-question', (data)=>{
        var parse = JSON.parse(data);
        console.log('broadcast status ' + parse.question.length + " status player " + parse.language_code);
        // if (checkRoom(parse.channel_code)){
        //     socket.to(parse.channel_code).emit('broadcast-question', JSON.stringify({ question: parse.question, language_name: parse.language_code, status: true }));
        // }else{
        // }
        socket.to(parse.channel_code).emit('broadcast-question', JSON.stringify({ question: parse.question, language_name: parse.language_code, status: false, target: 'receive_question' }));

    });

    
    socket.on('status-game', (data) => {
        var parse = JSON.parse(data);
        console.log('update status ' + parse.room_id + " status game " + parse.status_game);
        socket.to(parse.channel_code).emit('broadcast-status-game', JSON.stringify({ room_id: parse.room_id, status_game: parse.status_game, target: 'update-status-game' }));

        try {
            updateStatusGame(parse.room_id, parse.status_game)
        } catch (error) {
            console.log(error.message);
        }
    });
    
    socket.on('status-player', (data) =>{
        var parse = JSON.parse(data); 
        console.log('update status ' + parse.username + " status player " + parse.status_player + " score: " + parse.score);
        socket.to(parse.channel_code).emit('broadcast-status-player', JSON.stringify({ room_detail_id: parse.room_detail_id, is_ready: parse.is_ready, status_player: parse.status_player, score: parse.score, target: 'update-status-player' }));
        try {
            updateStatusPlayer(parse.room_detail_id, parse.status_player, parse.is_ready, parse.score )
        } catch (error) {
            console.log(error.message);
        }
    });


    /**
     * 1. channel_code
     * 2. language_code
     * 3. room_detail_id
     */
    socket.on('player-receive-question',(data)=>{
        try {
            var parse = JSON.parse(data);
            setPlayerReceiveQuestion(parse.room_detail_id);
            socket.to(data.channel_code).emit('info-another-receive-question', { channel_code: parse.channel_code, room_detail_id: parse.room_detail_id});
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect-room', (data)=>{
        var parse = JSON.parse(data);
        socket.to(parse.channel_code).emit('user-disconnected', JSON.stringify({ channel_code: parse.channel_code, player_id: parse.player_id, target: 'user-disconnected' }));
        console.log('disconnect room '+data);
        // deleteUserFromRoom(parse.channel_code, parse.language_name, parse.player_id)
    });
    socket.on('disconnect',(data) =>{
        console.log('a player disconnect ' + socket.id);
        deletePlayerIfDisconnect(socket.id, socket);
    });

    socket.on('test-question', (data) => {

        socket.to("room1").emit('test-broadcast-question', data);

    });

    socket.on('test-join-room', (data)=>{
        // data = '{"channel_code":"test"}'
        var parse = JSON.parse(data);
        console.log("join room " + data);
        socket.join(parse.channel_code);
    })

    socket.on('test-room', (data) => {

        socket.to("room1").emit('test-broadcast-room', data);

    });
   
});






module.exports = {socketapi, rooms};