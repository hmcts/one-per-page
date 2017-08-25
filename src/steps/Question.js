const Page = require('./Page');
const requireSession = require('./../middleware/requireSession');
const parseRequest = require('../middleware/parseRequest');
const bodyParser = require('body-parser');

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
    } else {
      if (this.fields.valid())
      res.end();
      // handle post
    }
  }
}

module.exports = Question;
