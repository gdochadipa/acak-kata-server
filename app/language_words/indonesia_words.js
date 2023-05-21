const mongoose = require('mongoose');

let indonesiaWordsSchema = mongoose.Schema({
    id: {
        type: Number,
        require: [true]
    },
    word: {
        type: String,
        require: [true]
    },
    meaning: {
        type: String,
        require: [true]
    },
    length_word: {
        type: Number,
        require: [true]
    },
    id_relation: {
        type: Number,

    }
});

module.exports = mongoose.model('indonesia_words', indonesiaWordsSchema);