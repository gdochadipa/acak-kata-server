const mongoose = require('mongoose');

/**
 * 1. daily activity bakal di panggil setiap hari
 * 2. track daily activity disimpan pada aplikasi pake sqlite
 */
let dailySchema = mongoose.Schema({
    language_code:{
        type:String,
    },
    daily_match_target:{
        type:Number
    },
    score_target:{
        type:Number
    }
});