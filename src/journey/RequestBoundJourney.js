const { defined } = require('../util/checks');

const getName = stepOrName => {
  if (typeof stepOrName === 'string') {
    return stepOrName;
  }
  if (defined(stepOrName.name)) {
    return stepOrName.name;
  }
  throw new Error(`${stepOrName} is not a step`);
};

class RequestBoundJourney {
  constructor(req, res, steps, settings) {
    this.req = req;
    req.journey = this;
    this.res = res;
    this.steps = steps;
    this.settings = settings;
    this.instances = {};
  }

  instance(Step) {
    const name = getName(Step);
    if (defined(this.instances[name])) {
      return this.instances[name];
    }
    if (defined(this.steps[name])) {
      this.instances[name] = new this.steps[name](this.req, this.res);
      return this.instances[name];
    }
    throw new Error(`${name} not registered`);
  }
}

module.exports = RequestBoundJourney;
