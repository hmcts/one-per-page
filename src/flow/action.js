const { notDefined } = require('../util/checks');
const logging = require('@log4js-node/log4js-api');

class Action {
  constructor(action, nextFlow, errorFlow) {
    this.action = action;
    this.nextFlow = nextFlow;
    this.errorFlow = errorFlow;
  }

  redirect(req, res) {
    const promise = this.performAction(req, res);

    return promise
      .then(() => {
        if (notDefined(this.nextFlow)) {
          logging.getLogger(this.name).error('No flow chained to action');
          return;
        }
        this.nextFlow.redirect(req, res);
      })
      .catch(() => {
        if (notDefined(this.errorFlow)) {
          logging.getLogger(this.name).error('No error flow chained to action');
          return;
        }
        this.errorFlow.redirect(req, res);
      });
  }

  performAction(req, res) {
    try {
      return Promise.resolve(this.action(req, res));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  then(nextFlow) {
    this.nextFlow = nextFlow;
    return this;
  }

  onFailure(errorFlow) {
    this.errorFlow = errorFlow;
    return this;
  }

  get step() {
    return this.nextFlow.step;
  }
}

module.exports = Action;
