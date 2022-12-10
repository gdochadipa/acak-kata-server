const mongoose = require('mongoose');

let dictWordSchema = mongoose.Schema({
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
    word_related: {
        type: String,
        require: [true]
    }
});

module.exports = mongoose.model('dict_words', dictWordSchema);