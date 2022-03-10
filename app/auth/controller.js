const Users = require('../user/model');
const crypto = require('crypto');
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    signup: async (req, res, next) => {
        
        try {
            const {email, name, username, password} = req.body;
            const generateUserCode = generateString(6);
           if(req.file){
                let tmp_path= req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

               const src = fs.createReadStream(tmp_path);
               const dest = fs.createWriteStream(target_path);

               src.pipe(dest);

               src.on('end', async ()=>{
                try {
                    
                    let user = new Users({
                        email: email,
                        name: name,
                        username: username,
                        password: password,
                        role: 'user',
                        user_code: generateUserCode,
                        avatar: filename 
                    });

                    await user.save();
                    delete user._doc.password;

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

                } catch (error) {
                    if (err && err.name === "ValidationError") {
                        return res.status(422).json({
                            error: 1,
                            message: err.message,
                            fields: err.errors,
                            status: false
                        })
                    }
                    next(err)
                }

               });
           }else{
               let user = new Users({
                   email:email,
                   name:name,
                   username:username,
                   password: password,
                   role:'user',
                   user_code: generateUserCode,

               });

               await user.save();
               delete user._doc.password;

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

        } catch (error) {
            if(error && error.name === "ValidationError"){
                return res.status(422).json({
                    message:error.message,
                    fields:error.errors,
                    status: false
                });
            }
            next(error);
        }

    },

    signin: async (req, res, next) => {
        const { email, password } = req.body

        Users.findOne({ email: email }).then((user) => {
            
            if (user){
                const checkPassword = bcrypt.compareSync(password, user.password)
                if (checkPassword) {
                    const token = jwt.sign({
                        user:{
                            id :user.id,
                            username:user.username,
                            email:user.email,
                            name:user.name,
                            avatar: user.avatar,
                            user_code:user.user_code
                        }
                    }, config.jwtKey)

                    res.status(200).json({
                        data:{token}
                    })
                } else {
                    res.status(403).json({
                        message: 'email atau password yang anda masukan salah'
                    })
                }
            }else{
                res.status(403).json({
                    message:'email yang anda masukan belum terdaftar'
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message:err.message || 'Internal server error'
            });
            next()
        });
        
    }
}