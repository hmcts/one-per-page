const Redirect = require('./Redirect');
const createSession = require('../session/createSession');

class EntryPoint extends Redirect {
  get middleware() {
    return [...super.middleware, createSession];
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  static get type() {
    return 'EntryPoint';
  }
}

module.exports = EntryPoint;
