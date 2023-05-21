const mongoose = require('mongoose');

let relationWordSchema = mongoose.Schema({
    id: {
        type: Number,
        require: [true]
    },
    word: {
        type: String,
        require: [true]
    },
    letter: {
        type: String,
        require: [true]
    },
    language_id: {
        type: Number,
        require: [true]
    },
    length_word: {
        type: Number,
        require: [true]
    },
    list_words:[{
        
        }]
});

module.exports = mongoose.model('relation_words', relationWordSchema);