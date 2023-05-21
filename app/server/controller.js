const ServerModel = require('./model');
const Users = require('../user/model');

const path = require('path')
const fs = require('fs')
const config = require('../../config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createServer: async(req, res, next) =>{
        try {

            let server = new ServerModel({
                url_api_server   : req.body.url_api_server,
                url_api_port     : req.body.url_api_port,
                url_socket_server: req.body.url_socket_server,
                url_socket_port  : req.body.url_socket_port,
                name_server      : req.body.name_server,
                main_server      : req.body.main_server,
                status_server    : req.body.status_server
            });

            await server.save();

            res.status(200).json({ data: server, status: true });
            
        } catch (err) {
            if (err.stack) {
                console.log('\nStacktrace:')
                console.log('====================')
                console.log(err.stack);
            }
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    updateStatusServer: async (req, res, next) => {
        try {
            let server = await ServerModel.findOneAndUpdate({ _id: req.body.id }, { status_server: req.body.status_server });
            res.status(200).json({ data: server, status: true });
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
    getListServer: async (req, res, next) => {
        try {
            let server = await ServerModel.find({});
            res.status(200).json({ data: server, status: true });
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
    getServerID: async (req, res, next) => {
        try {
            let server = await ServerModel.findById(req.query.id);
            res.status(200).json({ data: server, status: true });
        } catch (error) {
            res.status(500).json({ message: err.message || `Internal server error` })
        }
    },
    /**
    * 
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    syncUserServer: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            Users.findOne({ email: email, username: username }).then((user)=>{
                if(user){
                    /**
                     * membuat token baru ketika ada akun yang sesuai
                     */
                    const token = jwt.sign({
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar,
                            user_code: user.user_code
                        }
                    }, config.jwtKey)

                    res.status(200).json({
                        data: {
                            _id: user.id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar,
                            user_code: user.user_code
                        },
                        token: token
                    })
                }else{
                    
                    /**
                     * membuar akun user baru pada server baru
                     */
                    Users.insertMany([{
                        username: req.body.username,
                        email: req.body.email,
                        name: req.body.name,
                        avatar: req.body.avatar,
                        user_code: req.body.user_code,
                        password: req.body.password,
                    }]);

                    let user = Users.findOne({ email: email });

                    const token = jwt.sign({
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar,
                            user_code: user.user_code
                        }
                    }, config.jwtKey);

                    res.status(201).json({
                        data: user,
                        token: token,
                        status: true
                    });

                }
            });
            

            
        } catch (err) {
            res.status(500).json({
                message: err.message || 'Internal server error'
            });
            next()
        }
    },


}