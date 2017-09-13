const Page = require('./Page');
const requireSession = require('./../middleware/requireSession');
const parseRequest = require('../middleware/parseRequest');
const bodyParser = require('body-parser');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class Question extends Page {
  constructor() {
    super();
    expectImplemented(this, 'next', 'form');
  }

  get middleware() {
    return [
      ...super.middleware,
      bodyParser.urlencoded({ extended: true }),
      requireSession,
      parseRequest
    ];
  }

  handler(req, res) {
    if (req.method === 'GET') {
      super.handler(req, res);
    } else if (req.method === 'POST') {
      if (this.fields.valid) {
        this.fields.store(req);
        this.next().redirect(req, res);
      } else {
        res.render(this.template);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Question;
