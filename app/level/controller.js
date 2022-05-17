
const Level = require('./model');

module.exports = {
    index: async(req, res, next)=>{
        try {
            let level = await Level.find();

            res.status(200).json({
                data:level, status:true
            })
        } catch (error) {
            res.status(500).json({
                message: err.message || `Internal server error`,
                status: false
            })
        }
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * level_id => level id int
     */
    detail: async (req, res, next) => {
        try {
            const level_id = req.query.level_id;

            let level = await Level.findOne({ id: level_id});

            res.status(200).json({
                data: level, status: true
            })
        } catch (error) {
            res.status(500).json({
                message: err.message || `Internal server error`,
                status: false
            })
        }
    }
}