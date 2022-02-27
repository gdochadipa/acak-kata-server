const mongoose = require('mongoose');


let roomSchema = mongoose.Schema({
    room_code: {
        type: String,
        require: [true, 'Kode Room harus dibuat'],
    },
    channel_code: {
        type: String,
        require: [true, 'Kode Channel harus dibuat'],
    },
    status_game: {
        type: Int32Array,
        default: 1
    },
    time_start: {
        type: Date,
        require: [false]
    },
    time_match: {
        type: Int32Array
    },
    max_player: {
        type: Int32Array,
        default: 2
    },
    room_match_detail: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room_match_detail'
    }],
    language:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'languages'
    }

}, { timestamps: true });

roomSchema.path('room_code').validate(async function (value) {
    try {
        const count = await this.model('room_matches').countDocuments({ room_code: value })
        return !count;
    } catch (error) {
        throw err
    }

}, attr => `${attr.value} sudah terdaftar`);
module.exports = mongoose.model('room_matches')