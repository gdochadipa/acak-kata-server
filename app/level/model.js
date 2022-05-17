const mongoose = require('mongoose');


let levelSchema = mongoose.Schema({
    id:{
        type:Number,
        require:[true, "level id harus diisi"]
    },
    level_name:{
        type:String
    },
    level_words:{
        type:Number
    },
    level_time: {
        type: Number
    },
    level_question_count: {
        type: Number
    },
    level_lang_id: {
        type: Number
    },
    level_lang_code: {
        type: String
    },
    is_unlock: {
        type: Number
    },
    current_score: {
        type: Number
    },
    target_score: {
        type: Number
    },
    sorting_level: {
        type: Number
    }
});

module.exports = mongoose.model('levels', levelSchema);