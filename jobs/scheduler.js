let agenda = require('./index');
const nodeSchedule = require('node-schedule');
const JobHandlers = require('./handlers');


const schedule = {
    completeStartGame: async (data,time) => {
        // console.log(time);
        //schedule
        await agenda.schedule("1 minutes","send-notif-start-game", data);
    },
    testSchedule: async (data, time) => {
        await agenda.now("send monthly billing report");
        
    },
    testNodeSchedule: async(data, time) => {
        console.log(time);
        nodeSchedule.scheduleJob(time,()=>{
            console.log('Happy Birthday Babe ', new Date());
            console.log(data);
        })
    },
    runGameSchedule: async(callback, time) =>{
        //nanti bakal ngejalanin callback disini
        //callbacknya adalah socket berupa soal dulu baru status permainan dimulai
        console.log("a game start at :"+time);
        nodeSchedule.scheduleJob(time, () => {
            callback();
        })
    }
}

module.exports = {schedule}