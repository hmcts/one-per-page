const BaseStep = require('./BaseStep');
const addLocals = require('../middleware/addLocals');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const i18next = require('i18next');
const walkMap = require('../util/walkMap');
const applyContent = require('../middleware/applyContent');

class Page extends BaseStep {
  constructor() {
    super();

    if (this.i18NextContent) {
      this.i18next = i18next.createInstance();
      this.i18next.init({
        lng: 'en',
        resources: this.i18NextContent
      });
    }
  }

  get content() {
    if (!this.i18next) {
      return {};
    }

    return walkMap(this.i18NextContent.en.translation, path =>
      this.i18next.t(path, this.locals));
  }

  get middleware() {
    return [addLocals];
  }

  get afterMiddleware() {
    return [applyContent];
  }

  get template() {
    return `${this.name}/template`;
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
