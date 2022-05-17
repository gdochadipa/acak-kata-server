const mongoose = require('mongoose');

let baliWordsSchema = mongoose.Schema({
    id_word:{
        type: Number,
        require:[true]
    },
    word:{
        type:String,
        require: [true]
    },
    meaning:{
        type:String,
        require: [true]
    },
    length_word: {
        type: Number,
        require: [true]
    }
});

baliWordsSchema.statics.random = function (cb) {
    this.count(function (err, count) {
        if (err) return cb(err);
        var rand = Math.floor(Math.random() * count);
        return this.find().limit(5).skip(rand).exec(cb);
    }.bind(this));
};

const bali_words = mongoose.model('bali_words',baliWordsSchema);

var bali_words_random = async (limit = 10) =>{
    var count = await bali_words.count();
    var rand = Math.floor(Math.random() * count);
    bali = await bali_wordss.find().limit(limit).skip(rand)
    return bali;
}

module.exports = mongoose.model('bali_words',baliWordsSchema);