const User = require('./model')
const bcrypt = require('bcryptjs')


module.exports = {
    viewUsers: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus }

            const users = await User.find()

            res.render('admin/users/view_user',{
                users,
                alert,
                name:'Admin',
                title:'Halaman Users'
            })

        } catch (error) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    viewSignin: async(req,res) =>{
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus }
            if (req.session.user === null || req.session.user === undefined) {
                res.render('admin/users/view_signin', {
                    alert,
                    title: 'Halaman signin'
                })
            } else {
                res.redirect('/dashboard')
            }
        } catch (error) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }
    },
    actionSignin: async(req, res) =>{
        try {
            const { email, password } = req.body
            const check = await User.findOne({ email: email })

            if(check){
                if (check.status === 1 && check.role === 'admin'){
                    const checkPassword = await bcrypt.compare(password, check.password)
                    if (checkPassword) {
                        req.session.user = {
                            id: check._id,
                            email: check.email,
                            status: check.status,
                            name: check.name
                        }
                        res.redirect('/dashboard')
                    } else {
                        req.flash('alertMessage', `Kata sandi yang anda inputkan salah`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/')
                    }
                } else {
                    req.flash('alertMessage', `Mohon maaf status anda belum aktif`)
                    req.flash('alertStatus', 'danger')
                    res.redirect('/')
                }
            } else {
                req.flash('alertMessage', `Email yang anda inputkan salah`)
                req.flash('alertStatus', 'danger')
                res.redirect('/')
            }
        } catch (error) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
            
        }
    },
    actionLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/')
    }
}