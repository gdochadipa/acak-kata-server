const io = require("socket.io")();
const socketapi = {};

socketapi.io = io

// Add your socket.io logic here!
// io.on("connection", function (socket) {
//     console.log("A user connected");
//     socket.on('clientData', msg => {
//         console.log(msg);
//     });
//     // socket.on('hello', msg => {
//     //     io.emit('hello', msg);
//     // });
// });

socketapi.sendNotification = function (broadcast,event) {

    io.emit('hello', 'hello from the server');
    // io.sockets.on('clientData', msg => {
    //     console.log(msg);
    // });
    // io.sockets.on('clientData', msg => {
    //     io.emit(event, msg);
    //     console.log(msg);
    // });

}
// end of socket.io logic

module.exports = socketapi;