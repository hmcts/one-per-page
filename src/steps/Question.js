const Page = require('./Page');
const requireSession = require('./../middleware/requireSession');
const parseRequest = require('../middleware/parseRequest');

class Question extends Page {
  get middleware() {
    return [
      ...super.middleware,
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
      // handle post
    }
  }
}

module.exports = Question;
