const BaseStep = require('./BaseStep');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

class Page extends BaseStep {
  get template() {
    return this.name;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Page;
