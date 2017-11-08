const Page = require('./Page');
const destroySession = require('../session/destroySession');

class ExitPoint extends Page {
  get middleware() {
    return [...super.middleware, destroySession];
  }

  static get type() {
    return 'ExitPoint';
  }
}

module.exports = ExitPoint;
