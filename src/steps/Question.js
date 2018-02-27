const Page = require('./Page');
const requireSession = require('./../session/requireSession');
const bodyParser = require('body-parser');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const { answer } = require('./check-your-answers/answer');
const { form } = require('../forms');
const { RefValue } = require('../forms/fieldValue');
const logging = require('@log4js-node/log4js-api');
const { ifCompleteThenContinue } = require('../flow/treeWalker');
const preventCaching = require('../middleware/preventCaching');

class Question extends Page {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'next');
  }

  get middleware() {
    return [
      ...super.middleware,
      bodyParser.urlencoded({ extended: true }),
      requireSession,
      preventCaching
    ];
  }

  renderPage() {
    this.retrieve();
    if (this.fields.isFilled) {
      this.validate();
    }
    this.res.render(this.template, this.locals);
  }

  handler(req, res, next) {
    if (req.method === 'GET') {
      this.renderPage();
    } else if (req.method === 'POST') {
      this.parse();
      this.validate();

      if (this.valid) {
        this.store();
        this.next().redirect(req, res, next);
      } else {
        this.storeErrors();
        res.redirect(this.path);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  answers() {
    return answer(this);
  }

  values() {
    return Object.values(this.fields)
      .filter(field => !(field instanceof RefValue))
      .reduce((values, field) =>
        Object.assign(values, { [field.name]: field.value }), {}
      );
  }

  get form() {
    const logger = logging.getLogger(this.name);
    logger.info('No form defined. Using default empty form.');

    return form();
  }

  get postUrl() {
    return this.path;
  }

  next() {
    const logger = logging.getLogger(this.name);
    const message = `No next() defined for ${this.name}`;
    logger.error(message);
    throw new Error(message);
  }

  get flowControl() {
    return ifCompleteThenContinue(this);
  }

  retrieve() {
    this.fields = this.form.retrieve(this.name, this.req);
    return this;
  }

  parse() {
    this.fields = this.form.parse(this.req);
    return this;
  }

  store() {
    this.fields.store(this.name, this.req);
    return this;
  }

  storeErrors() {
    this.fields.tempStore(this.name, this.req);
    return this;
  }

  validate() {
    this.fields.validate();
    return this;
  }

  get valid() {
    return this.fields.valid;
  }
}

module.exports = Question;
