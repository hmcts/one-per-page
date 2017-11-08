const Page = require('./Page');
const requireSession = require('./../session/requireSession');
const parseRequest = require('../forms/parseRequest');
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
      requireSession,
      parseRequest
    ];
  }

  handler(req, res) {
    if (req.method === 'GET') {
      super.handler(req, res);
    } else if (req.method === 'POST') {
      if (this.fields.valid) {
        this.fields.store(req);
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

  static get type() {
    return 'Question';
  }

  get form() {
    const logger = logging.getLogger(this.name);
    logger.info('No form defined. Using default empty form.');

    return form();
  }
}

module.exports = Question;
