const {roomDefinition} = require("./room_match");

const definitions = [roomDefinition];

const allDefinitions = (agenda) =>{
    definitions.forEach((definition)=>definition(agenda));
}

module.exports = {allDefinitions}