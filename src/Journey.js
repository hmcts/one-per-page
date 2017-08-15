const Router = require('router');

const defaults = { steps: [] };

class Journey extends Router {
  constructor(options = defaults) {
    console.log(options);
    super();
    this.steps = options.steps;
    this.steps.forEach(step => {
      this.use(step.router);
    });
  }
}

module.exports = Journey;
