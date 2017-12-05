const EntryPoint = require('../../../src/steps/EntryPoint');
const Question = require('../../../src/steps/Question');
const { goTo, RequestBoundJourney } = require('../../../src/flow');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.A);
  }
}
class A extends Question {
  next() {
    return goTo(this.journey.steps.B);
  }
}
class B extends Question {
  next() {
    return goTo(this.journey.steps.A);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, A, B, CheckAnswers };
const req = { session: { entryPoint: Entry.name } };
const res = {};

const journey = new RequestBoundJourney(req, res, steps, {});

module.exports = journey;
