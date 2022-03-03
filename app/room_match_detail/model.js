const mongoose = require("mongoose");

let roomDetailSchema = mongoose.Schema({
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    is_host: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },


});

module.exports = mongoose.model('room_match_detail',roomDetailSchema);

