const EntryPoint = require('../../../src/steps/EntryPoint');
const Question = require('../../../src/steps/Question');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { goTo, RequestBoundJourney } = require('../../../src/flow');
const { text, form } = require('../../../src/forms');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.Name);
  }
}
class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, Name, CheckAnswers };
const session = {
  entryPoint: Entry.name,
  Name: { firstName: 'Michael', lastName: 'Allen' },
  CheckAnswers: { statementOfTruth: true }
};
const res = {};
const req = { session };

const journey = () => new RequestBoundJourney(req, res, steps, {});

module.exports = { journey, Entry, Name, CheckAnswers };
