const Language = require('./model');

module.exports={
    index: async(req, res, next)=>{
        try {
            let languages = await Language.find();

            res.status(200).json({
                data:languages, status:true
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || `Internal server error`,
                status: false
            })
        }
    }
}