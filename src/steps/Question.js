const Page = require('./Page');
const requireSession = require('./../middleware/requireSession');
const parseRequest = require('../middleware/parseRequest');
const bodyParser = require('body-parser');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class Question extends Page {
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
      if (this.fields.valid()) {
        this.fields.store();
        this.next().redirect(req, res);
      } else {
        res.redirect(this.url);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Question;
