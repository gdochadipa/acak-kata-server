var socket = require('../../socketio')
var room_match = require('./model')

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
     */
    createRoom: async (req, res, next) => {

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