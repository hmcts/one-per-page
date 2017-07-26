const ValidationStep = require('lib/opp/steps/ValidationStep');
const runStepHandler = require('lib/opp/core/runStepHandler');

class StepOne extends ValidationStep {

    get url () {
        return '/step-one';
    }

    get nextStep () {
        return this.steps.StepTwo;
    }

    handler(req, res) {
        return runStepHandler(this, req, res);
    }

}

module.exports = StepOne;
