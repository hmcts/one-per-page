const Page = require('./Page');
const requireSession = require('./../middleware/requireSession');
const parseRequest = require('../middleware/parseRequest');
const bodyParser = require('body-parser');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const { expectImplemented } = require('../errors/expectImplemented');

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

  get template() {
    return this.name;
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
    }
  }
}

module.exports = Question;
