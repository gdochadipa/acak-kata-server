var { socketapi, rooms} = require('../../socketio')
var RoomMatch = require('./model')
var RoomMatchDetail = require('../room_match_detail/model');
const LanguageWords = require('../language_words/language_words');
var Language = require('../languages/model');
var Level = require('../level/model');
var moment = require('moment-timezone');

var stringGenerate = (length=5, charlistBol= true)=>{
    var text = "";
    var charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (!charlistBol){
        charList = "0123456789";
    }
    
    for (let i = 0; i < length; i++) {
        text += charList.charAt(Math.floor(Math.random()*charList.length));
    }
    return text;
}

var suffleWords = (words =[])=>{
    if(words.length > 0){
        var i = words.length;
        var k, temp;
        while (--i > 0) {
            k = Math.floor(Math.random() * (i+1))
            temp = words[k]
            words[k] = words[i];
            words[i] = temp;
        }
    }
    return words;
}

module.exports = {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * method POST
     * 1. validate language_id
     * 2. load languange by data id
     * 3 load collection language by collection language name
     * 4. get all data language limit 2000 but random
     * 5. generate random channel_code and room_code
     * 6. create new data room_match 
     * 7. status game => 0; max_player => 2; time_match => 0; time_start => null
     * 8. create detail room match => player_id => who create the match; is_host => 1; score => 0
     * 
     * parameter
    * language_code
     * time_watch
     * datetime_match,
     * total_question,
     * max_player
     * level
     * 
     * nanti pada client setelah ngejalanin fungsi method ini pada client, 
    * dari client wajib ngirim emit ke search-room untuk daftar 
     */
    createRoom: async (req, res, next) => {
        try {
            const language = await Language.findOne({language_code: req.body.language_code});
            const maxPlayer = req.body.max_player;
            const totalQuestion = req.body.total_question;
            const roomCode = stringGenerate(8, false);
            const channel_code = stringGenerate(12);
            const datetime_match = new Date(req.body.datetime_match);
            const level_id = req.body.level;
            const now = moment(datetime_match).tz("Asia/Makassar").format("YYYY-MM-DD HH:mm:ss"); 
            let roomMatchDetail = new RoomMatchDetail({
                player_id    : req.user._id,
                player       : req.user._id,
                is_host      : 1,
                score        : 0,
                is_ready     : 0,
                status_player: 1
            })

            await roomMatchDetail.save();

            let roomMatch = new RoomMatch({
                room_code     : roomCode,
                channel_code  : channel_code,
                status_game   : 0,
                datetime_match: now,
                time_match    : req.body.time_match,
                total_question: totalQuestion,
                max_player    : maxPlayer,
                level_id: level_id,
                room_match_detail:[
                    roomMatchDetail._id
                ],
                language: language._id
            });

            await roomMatch.save();

            await RoomMatchDetail.findOneAndUpdate({_id:roomMatchDetail},{room_id:roomMatch._id});

            let result = await RoomMatch.findOne({ _id: roomMatch._id})
                .populate({
                    path: 'room_match_detail',
                    populate:{
                        path: 'player',
                        select: '_id email name username role user_code createdAt updatedAt'
                    }
                }).populate('language');

            // socketapi.io.emit("test", channel_code, language.language_code, req.user._id);
            res.status(200).json({ data: result, status: true });

            
        } catch (err) {
            if (err.stack) {
                console.log('\nStacktrace:')
                console.log('====================')
                console.log(err.stack);
            }
            res.status(500).json({ message: err.message|| `Internal server error` })
        }

    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    searchingRoomWithoutCode: async (req, res, next) => {

    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * 
     * * parameter  
     * language_id
     * time_watch
     * room_code
     * 
     * 
     * nanti pada client setelah ngejalanin fungsi method ini pada client, 
    * dari client wajib ngirim emit ke search-room untuk daftar 
     */
    searchingRoomWithCode: async (req, res, next) =>{
        try {
            let roomMatch = await RoomMatch.findOne({ room_code: req.body.room_code })
            .populate({
                path: 'room_match_detail'
            });

            if (!roomMatch) {
                return res.status(403).json({message:"Room tidak ditemukan", status:false})
            }

            if (roomMatch.room_match_detail.length >= roomMatch.max_player ){
                return res.status(403).json({ message: "Room sudah penuh", status: false })
            }

            var foundUser = roomMatch.room_match_detail.find((element) => element.player_id.toString() == req.user._id.toString());
            console.log(foundUser);
            // console.log(req.user._id);
            // console.log(roomMatch.room_match_detail);

            let newRoom = [];
            roomMatch.room_match_detail.forEach(element => {
                newRoom.push(element._id);
            });

            let roomDetail = new RoomMatchDetail({
                player_id: req.user._id, 
                player: req.user._id, 
                room_id: roomMatch._id,
                is_host:0, 
                score:0,
                is_ready: 0,
                status_player:1
            });
            
            if (foundUser == undefined){
                await roomDetail.save()

                newRoom.push(roomDetail._id);
            }
            

            await RoomMatch.findOneAndUpdate(
                { _id: roomMatch._id },
                { room_match_detail: newRoom }
            );

            let result = await RoomMatch.findOne({ _id: roomMatch._id }).populate({
                path: 'room_match_detail',
                populate: {
                    path: 'player',
                    select: '_id email name username role user_code createdAt updatedAt'
                }
            }).populate('language')


            res.status(200).json({ data: result, status: true });


        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },

    findRoomWithRoomCode:async (req, res, next) =>{
        try {
            let roomMatch = await RoomMatch.findOne({ room_code: req.body.room_code })
                .populate({
                    path: 'room_match_detail',
                    populate: {
                        path: 'player',
                        select:'_id email name username role user_code createdAt updatedAt'
                    }
                });

            if (!roomMatch) {
                return res.status(403).json({ message: "Room tidak ditemukan",status:false })
            }

            if (roomMatch.room_match_detail.length >= roomMatch.max_player) {
                return res.status(403).json({ message: "Room sudah penuh", status: false })
            }

            res.status(200).json({ data: roomMatch, status: true });

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * input 
     * _id
     * 
     * emmit di client flutter
     * 
     */
    confirmGame: async (req, res, next) => {
        try {
            let result = await RoomMatch.findOne({ _id:req.body.room_id })
                .populate({
                    path: 'room_match_detail'
                });

            let confirmDataPlayer = result.room_match_detail.filter((e) =>{
                return String(e.player_id) == String(req.user._id);
            });
            // console.log(req.user._id);
            // console.log(result.room_match_detail);
            // console.log(confirmDataPlayer);

            if(confirmDataPlayer == null || confirmDataPlayer.length < 1){
                throw new Error("Pemain tidak ditemukan di room");
            }

            let room = await RoomMatchDetail.findOneAndUpdate({ _id: confirmDataPlayer[0]._id }, { is_ready: 1})

            if (!room){
                throw new Error("Gagal update confirm game");
            }
            res.status(200).json({message:"success confirm game", status:true})

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * input 
     * room_id
     * 
     */
    cancelGameFromRoom: async(req, res, next) => {
        try {
            let result = await RoomMatch.findOne({ _id: req.body.room_id })
                .populate({
                    path: 'room_match_detail'
                });

            if (result.room_match_detail.length < result.max_player && result.room_match_detail.length == 1) {
                throw new Error("Pemain kurang dari maksimal player");
                //kayaknya hapus room_match karena engga ada player di room
            }

            let confirmDataPlayer = result.room_match_detail.filter((e) => {
                return e.player_id == req.user._id ? e : null
            });


            if (confirmDataPlayer == null) {
                throw new Error("Pemain tidak ditemukan di room");
            }
            let roomDetailArr = result.room_match_detail;
            roomDetailArr.splice(roomDetailArr.findIndex(v => v._id == confirmDataPlayer._id),1);


            await RoomMatchDetail.findOneAndDelete({ _id: confirmDataPlayer._id })
            res.status(200).json({ message: "success cancel", status: true })

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * input
     * language_code => string
     * question_num => int
     * channel_code => string
     * length_word => int
     */
    getPackageQuestion: async (req, res, next) => {
        try {
            const language = await Language.findOne({language_code:req.query.language_code});
            const limit = req.query.question_num ?? 10;
            const length_w = req.query.length_word ?? 3;
            let words;
            switch (language.language_collection) {
                case 'indonesia_words': 
                    var count = await LanguageWords.IndonesiaWords.count();
                    var rand = Math.floor(Math.random() * count);
                    words = await LanguageWords.IndonesiaWords.find({ length_word: length_w });
                    break;

                case 'jawa_words':
                    var count = await LanguageWords.JawaWords.count();
                    var rand = Math.floor(Math.random() * count);
                    words = await LanguageWords.JawaWords.find({ length_word: length_w });
                    break;

                case 'bali_words':
                    var count = await LanguageWords.BaliWords.count();
                    var rand = Math.floor(Math.random() * count);
                    words = await LanguageWords.BaliWords.find({ length_word: length_w });
                    break;

                case 'english_words':
                    var count = await LanguageWords.EnglishWords.count();
                    var rand = Math.floor(Math.random() * count);
                    words = await LanguageWords.EnglishWords.find({ length_word: length_w });
                    break;

                default:
                    var count = await LanguageWords.BaliWords.count();
                    var rand = Math.floor(Math.random() * count);
                    words = await LanguageWords.EnglishWords.find({ length_word: length_w });
                    break;
            }
            
            words = suffleWords(words);
            words = words.slice(0, limit);

            socketapi.io.to(req.query.channel_code).emit('broadcast-question', JSON.stringify({ question: words, language_name: language.language_name, status: true }));

            res.status(200).json({data:words, status:true})
        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error`, status: false})
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * input:
     * room_match_detail => id
     * score => int
     * 
     */
    saveScoreMatch: async (req, res, next) => {
        try {
            await RoomMatchDetail.findOneAndUpdate({ _id: req.body.room_march_detail_id},{score:req.body.score});

            res.status(200).json({status: true })

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error`, status: false })
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * input:
     * room_match_id => id
     * 
     */
    getResultMatch: async(req, res, next) =>{
        try {
            let result = await RoomMatch.findOne({ _id: req.body.room_march_detail_id})
                .populate({
                    path: 'room_match_detail',
                    populate: {
                        path: 'player',
                        select: '_id email name username role user_code createdAt updatedAt'
                    }
                }).populate({
                    path: 'language'
                });

            res.status(200).json({data:result , status: true })

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error`, status: false })
        }
    },

    

    
}