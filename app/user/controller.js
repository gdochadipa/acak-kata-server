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

            res.status(200).json({ data: user, status:true });

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },
     editProfile: async(req, res) => {
        try {
            let request = req.body;

            if(req.user._id != request._id){
                return res.status(403).json({ message: "User tidak ditemukan", status: false })
            }

            await Users.findOneAndUpdate({_id:req.user.id},{
                username: request.username,
                email: request.email,
                name: request.name

            });

            let user = await Users.findOne({ _id: req.user.id });

            res.status(200).json({ data: user, status: true });

        } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
     },
     editPhotoProfile: async(req, res) => {
        
     }
}