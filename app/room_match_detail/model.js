const mongoose = require("mongoose");

let roomDetailSchema = mongoose.Schema({
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    is_host: {
        type: Int32Array,
        default: 0
    },
    score: {
        type: Int32Array,
        default: 0
    },


});

module.exports = mongoose.model('room_match_detail');

