var { socketapi, rooms} = require('../../socketio')
var RoomMatch = require('./model')
var RoomMatchDetail = require('../room_match_detail/model');
const LanguageWords = require('../language_words/language_words');
var Language = require('../languages/model');
var moment = require('moment-timezone');

var stringGenerate = (length=5)=>{
    var text = "";
    var charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) {
        text += charList.charAt(Math.floor(Math.random()*charList.length));
    }
    return text;
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
     * language_id
     * time_watch
     * 
     * 
     * nanti pada client setelah ngejalanin fungsi method ini pada client, 
     * dari client wajib ngirim 
     */
    createRoom: async (req, res, next) => {
        try {
            const language = await Language.findById(req.body.language_id);
            const roomCode = stringGenerate(7);
            const channel_code = stringGenerate(12);
            const now = moment().tz("Asia/Makassar").format();
            let roomMatchDetail = new RoomMatchDetail({
                player_id: req.user._id,
                is_host: 1,
                score:0
            })

            await roomMatchDetail.save();

            let roomMatch = new RoomMatch({
                room_code:roomCode,
                channel_code:channel_code,
                status_game:0,
                time_start: now,
                time_match:req.body.time_match,
                max_player:2,
                room_match_detail:[
                    roomMatchDetail._id
                ],
                language:language._id
            });

            await roomMatch.save();

            let result = await RoomMatch.findOne({ _id: roomMatch._id})
                .populate({
                    path: 'room_match_detail',
                    populate:{
                        path: 'player_id'
                    }
                });

            // socketapi.io.emit("test", channel_code, language.language_code, req.user._id);
            res.status(200).json({ data: result });


            // const words;
            // switch (language.language_collection) {
            //     case 'indonesia_words': 
            //         words = await LanguageWords.IndonesiaWords.find().limit(200)
            //         break;
            //     case 'jawa_words':
            //         words = await LanguageWords.JawaWords.find().limit(200)
            //         break;
            //     case 'bali_words':
            //         words = await LanguageWords.BaliWords.find().limit(200)
            //         break;
            //     case 'english_words':
            //         words = await LanguageWords.EnglishWords.find().limit(200)
            //         break;
            //     default:
            //         words = await LanguageWords.EnglishWords.find().limit(200)
            //         break;
            // }
            
        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
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
     */
    searchingRoomWithCode: async (req, res, next) =>{

    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    confirmGame: async (req, res, next) => {},

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    cancelGameFromRoom: async(req, res, next) => {},

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getPackageQuestion: async (req, res, next) => {},

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    sendAllAnswerSendToServer: async (req, res, next) => {},

    
}