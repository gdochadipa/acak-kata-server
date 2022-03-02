const mongoose = require('mongoose');

let roomSocketSchema = mongoose.Schema({
    channel_code:{
        type:String
    },
    player_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    language_code:{
        type:String,
    },
    socket_id:{
        type:String
    }
});

module.exports = mongoose.model('room_socket',roomSocketSchema);