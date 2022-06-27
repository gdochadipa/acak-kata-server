const mongoose = require("mongoose");

let roomDetailSchema = mongoose.Schema({
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    room_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room_matches'
    },
    is_host: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    /**
     * 0 is not ready
     * 1 is ready 
     */
    is_ready:{
        type:Number,
        default: 0
    },
    /**
    * 0 is not ready
    * 1 is ready but not receive question
    * 2 is receive question
    * 3 is game done
    * 4 is player out from room
    */
    status_player:{
        type:Number,
        default:0
    },
    rank_player : {
        type:Number,
        default:0
    }


}, { timestamps: true });

module.exports = mongoose.model('room_match_detail',roomDetailSchema);

