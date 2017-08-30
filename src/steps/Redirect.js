const BaseStep = require('./BaseStep');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class Redirect extends BaseStep {
  constructor() {
    super();
    expectImplemented(this, 'next');
  }

  handler(req, res) {
    if (req.method === 'GET') {
      this.next().redirect(req, res);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Redirect;
