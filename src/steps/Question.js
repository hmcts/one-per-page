const Page = require('./Page');
const requireSession = require('./../session/requireSession');
const bodyParser = require('body-parser');
const { expectImplemented } = require('../errors/expectImplemented');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const answer = require('./check-your-answers/answer');
const formProxyHandler = require('../forms/formProxyHandler');
const { form } = require('../forms');
const logging = require('@log4js-node/log4js-api');

class Question extends Page {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'next');

    const _form = this.form.bind(this);
    this.fields = new Proxy(_form, formProxyHandler);
  }

  get middleware() {
    return [
      ...super.middleware,
      bodyParser.urlencoded({ extended: true }),
      requireSession
    ];
  }

  handler(req, res) {
    if (req.method === 'GET') {
      this.retrieve();
      super.handler(req, res);
    } else if (req.method === 'POST') {
      this.parse().validate();

      if (this.valid) {
        this.store();
        this.next().redirect(req, res);
      } else {
        res.render(this.template, this.locals);
      }
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }

  answers() {
    return answer(this);
  }

  static get type() {
    return 'Question';
  }

  get form() {
    const logger = logging.getLogger(this.name);
    logger.info('No form defined. Using default empty form.');

    return form();
  }

  retrieve() {
    this.fields.retrieve(this.req);
    return this;
  }

  parse() {
    this.fields.parse(this.req);
    return this;
  }

  store() {
    this.fields.store(this.req);
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
