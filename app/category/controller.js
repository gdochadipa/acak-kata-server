var socket = require('../../socketio')

module.exports={
    index:async(req,res)=>{
        try {
            res.render('index', { title: 'Express' });
            socket.io.on("connection", function (socket) {
                socket.on('clientData', msg => {
                    console.log(msg);
                });
            });
            
        } catch (error) {
            console.log(error);
        }
    }
}