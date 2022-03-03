const Users = require('./model');
const LanguageWords = require('../language_words/language_words');

module.exports = {
    profile: async(req,res) =>{
        try {
            var bali;
            const user = {
                id      : req.user._id,
                username: req.user.username,
                email   : req.user.email,
                name    : req.user.name,
                avatar  : req.user.avatar
            }

            res.status(200).json({ data: user });

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    }
}