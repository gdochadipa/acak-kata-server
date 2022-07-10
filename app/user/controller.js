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
            let request = req.params;

            if (req.user._id != request.userId){
                return res.status(403).json({ message: "User tidak ditemukan", status: false })
            }

            let count = await Users.countDocuments({ email: req.body.email });
            if (count > 1) {
                return res.status(403).json({ message: `${req.body.email} sudah terdaftar`, status: false })
            }

            await Users.findOneAndUpdate({_id:req.user.id},{
                username: req.body.username,
                email: req.body.email,
                name: req.body.name

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