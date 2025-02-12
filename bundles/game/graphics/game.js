// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:
const nodecg = require("../../../cfg/nodecg");

nodecg.Replicant('team1', {defaultValue: "team 1"});
nodecg.Replicant('team2', {defaultValue: "team 2"});

nodecg.Replicant('team1Points', {defaultValue: 0});
nodecg.Replicant('team2Points', {defaultValue: 0});

nodecg.Replicant('matchType', {defaultValue: "Grand Finals"});
nodecg.Replicant('bestOf', {defaultValue: 3});


nodecg.Replicant('assets:teamsOverlay');