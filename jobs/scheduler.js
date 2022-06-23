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
    }
}

module.exports = {schedule}