const Question = require('./Question');
const { expectImplemented } = require('../errors/expectImplemented');
const { ifCompleteAndNotForceShowThenContinue } = require('../flow/treeWalker');

class QuestionWithRequiredNextSteps extends Question {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'requiredNextSteps');
  }

  get flowControl() {
    return ifCompleteAndNotForceShowThenContinue(this);
  }

  get middleware() {
    return [
      ...super.middleware, (req, res, next) => {
        if (req.method.toLowerCase() === 'post') {
          this.journey.forceShow = this.requiredNextSteps();
        }
        next();
      }
    ];
  }
}

module.exports = QuestionWithRequiredNextSteps;
