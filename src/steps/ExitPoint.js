const Page = require('./Page');
const destroySession = require('../middleware/destroySession');

class ExitPoint extends Page{
  get middleware() {
    return [...super.middleware, destroySession];
  }
}

module.exports = ExitPoint;
