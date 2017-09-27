const Redirector = require('./redirector');
const Branch = require('./branch');

const goTo = step => new Redirector(step);
const branch = (...redirectors) => new Branch(...redirectors);

module.exports = { goTo, branch };
