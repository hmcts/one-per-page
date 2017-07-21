const ValidationStep = require('lib/opp/steps/ValidationStep');
const runStepHandler = require('lib/opp/core/runStepHandler');

class StepTwo extends ValidationStep {

    get url () {
        return '/step-two';
    }

    get nextStep () {
        return null;
    }

    handler(req, res) {
        return runStepHandler(this, req, res);
    }
}

module.exports = StepTwo;
