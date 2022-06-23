const { urlDb } = require('../config');
const Agenda = require("agenda");
const {allDefinitions} =  require("./definitions")

const agenda = new Agenda(
    { db: 
        { 
            address: urlDb, 
            collection: "jobs", 
             options: { useUnifiedTopology: true }, 
        },
        maxConcurrency: 20, 
        processEvery: "1 minute",
    }
);

agenda
.on('ready', () => console.log("Agenda started!"))
.on('error', () => console.log("Agenda connection error!"));

allDefinitions(agenda);


console.log({ jobs: agenda._definitions });

module.exports = agenda;