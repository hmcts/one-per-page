const Redirect = require('./Redirect');
const createSession = require('../session/createSession');

class EntryPoint extends Redirect {
  get middleware() {
    return [...super.middleware, createSession];
  }
}

module.exports = EntryPoint;
