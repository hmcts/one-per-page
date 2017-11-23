const Redirector = require('./redirector');
const Branch = require('./branch');
const Stop = require('./stop');

const goTo = step => new Redirector(step);
const branch = (...redirectors) => new Branch(...redirectors);
const stop = step => new Stop(step);

module.exports = { goTo, branch, stop };
