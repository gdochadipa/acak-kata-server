const JobHandlers = require('../handlers')

const roomDefinition = (agenda) =>{
    agenda.define("send-notif-start-game",JobHandlers.completeCreateJobRoom);
    agenda.define("send monthly billing report", async (job,done) => {
        console.log(job.attrs.data.data);
        console.log("janggal");
        done();
        
    });
    
}

module.exports = { roomDefinition}