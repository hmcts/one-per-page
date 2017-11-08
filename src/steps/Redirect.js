const BaseStep = require('./BaseStep');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class Redirect extends BaseStep {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'next');
  }

  handler(req, res) {
    if (req.method === 'GET') {
      this.next().redirect(req, res);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  static get type() {
    return 'Redirect';
  }
}

module.exports = Redirect;
