const BaseStep = require('./BaseStep');
const {
  METHOD_NOT_ALLOWED,
  INTERNAL_SERVER_ERROR
} = require('http-status-codes');
const logging = require('@log4js-node/log4js-api');

const SUCCESS = Symbol('success');
const FAILED = Symbol('failed');
const NOT_EXECUTED = Symbol('not executed');

class Action extends BaseStep {
  constructor(...args) {
    super(...args);
    this.outcome = NOT_EXECUTED;
  }

  handler(req, res) {
    if (req.method !== 'GET') {
      res.sendStatus(METHOD_NOT_ALLOWED);
      return;
    }
    this.performAction().then(
      results => {
        this.results = results;
        this.outcome = SUCCESS;
        this.next().redirect(req, res);
      },
      error => {
        const logger = logging.getLogger(this.name);
        logger.error(error);
        this.outcome = FAILED;
        this.next().redirect(req, res);
      }
    )
      .catch(error => {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(error.message);
      });
  }

  performAction() {
    try {
      return Promise.resolve(this.action());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get success() {
    return this.outcome === SUCCESS;
  }

  get failed() {
    return this.outcome === FAILED;
  }

  action() {
    const logger = logging.getLogger(this.name);
    logger.info('No #action defined');
  }

  next() {
    const logger = logging.getLogger(this.name);
    const message = 'No #next defined';
    logger.error(message);
    throw new Error(message);
  }
}

module.exports = Action;
