const Page = require('./Page');
const requireSession = require('./../session/requireSession');
const parseRequest = require('../forms/parseRequest');
const bodyParser = require('body-parser');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const answer = require('./check-your-answers/answer');

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
      if (req.fields.valid) {
        req.fields.store(req);
        this.next().redirect(req, res);
      } else {
        res.render(this.template);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  answers() {
    return answer(this);
  }
}

module.exports = Question;
