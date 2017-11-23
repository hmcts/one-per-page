const { defined } = require('../util/checks');
const Question = require('../steps/Question');
const Stop = require('../flow/stop');

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

  get entryPoint() {
    if (defined(this.req.session.entryPoint)) {
      return this.req.session.entryPoint;
    }
    throw new Error('No entryPoint defined in session');
  }

  walkTree(from = this.entryPoint) {
    let current = this.instance(from);
    let iterations = 0;
    const results = [];
    const numberOfSteps = Object.keys(this.steps).length;
    while (iterations <= numberOfSteps) {
      if (current instanceof Question) {
        results.push(current);
        current.retrieve().validate();

        if (!current.valid) {
          return results;
        }
      }
      if (typeof current.next === 'undefined') {
        return results;
      }
      if (current.next() instanceof Stop) {
        return results;
      }
      const nextStep = current.next().step;
      current = this.instance(nextStep);

      iterations += 1;
    }
    throw new Error('possible infinite loop encountered');
  }
}

module.exports = RequestBoundJourney;
