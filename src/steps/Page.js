const BaseStep = require('./BaseStep');
const addLocals = require('../middleware/addLocals');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const loadStepContent = require('../i18n/loadStepContent');
const resolveTemplate = require('../middleware/resolveTemplate');
const { i18NextInstance } = require('../i18n/i18Next');
const { contentProxy } = require('../i18n/contentProxy');

class Page extends BaseStep {
  constructor() {
    super();
    this.content = new Proxy(i18NextInstance, contentProxy(this));
  }

  get middleware() {
    return [resolveTemplate, addLocals, loadStepContent];
  }

  get locals() {
    return this.res.locals;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Page;
