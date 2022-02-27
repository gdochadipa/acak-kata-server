const language = require('./model');

module.exports={
    index: async(req, res, next)=>{
        try {
            const languages = language.find();

            res.status(200).json({
                data:languages
            })
        } catch (err) {
            res.status(500).json({
                message: err.message || `Internal server error`
            })

            next()
        }
    }
}