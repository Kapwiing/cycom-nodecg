// You can access the NodeCG api anytime from the `window.nodecg` object
// Or just `nodecg` for short. Like this!:

const nodecg = require("../../../cfg/nodecg");

nodecg.Replicant('caster1', {defaultValue: "Caster 1"});
nodecg.Replicant('caster1Twitter', {defaultValue: "@Caster1"});

nodecg.Replicant('assets:castersOverlay');
