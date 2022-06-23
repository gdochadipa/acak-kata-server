const io = require("socket.io")();
const socketapi = {};
socketapi.io = io
module.exports = {
    completeCreateJobRoom: async (job, done) => {
        console.log(job.attrs.data.data);
        console.log("Berhasil membuat jadwal permainan");
        socketapi.io.emit('eventName', "on test");
        done();
    },
    jobTestSchedule: async (data)=>{
        console.log('Happy Birthday Babe ', new Date());
        console.log(data);
    }
}