const BaseStep = require('./BaseStep');
const addLocals = require('../middleware/addLocals');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const loadStepContent = require('../i18n/loadStepContent');
const resolveTemplate = require('../middleware/resolveTemplate');

class Page extends BaseStep {
  get middleware() {
    return [resolveTemplate, addLocals, loadStepContent];
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
