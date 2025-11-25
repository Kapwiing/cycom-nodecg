// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:

const nodecg = require("../../../cfg/nodecg");

nodecg.Replicant('player', {defaultValue: "Player"});
nodecg.Replicant('playerData', {defaultValue: {}});

nodecg.Replicant('assets:statsOverlay');
