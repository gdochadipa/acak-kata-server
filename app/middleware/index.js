const config = require('../../config')
const jwt = require('jsonwebtoken')
const Users =require('../user/model')

module.exports = {
    isLoginUsers:async(req, res, next) =>{
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

            const data = jwt.verify(token, config.jwtKey)

            const user = await Users.findOne({_id: data.user.id})

            if (!user) {
                throw new Error()
            }

            req.user = player
            req.token = token
            next()
        } catch (error) {
            res.status(401).json({
                error: 'Not authorized to acces this resource'
            })
        }
    }
}