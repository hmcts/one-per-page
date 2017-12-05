const EntryPoint = require('../../../src/steps/EntryPoint');
const Question = require('../../../src/steps/Question');
const { branch, goTo, RequestBoundJourney } = require('../../../src/flow');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { textField, form } = require('../../../src/forms');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.Branch);
  }
}
class Branch extends Question {
  get form() {
    return form(textField('branchControl'));
  }
  next() {
    const isA = this.fields.branchControl.value === 'A';
    const isB = this.fields.branchControl.value === 'B';
    return branch(
      goTo(this.journey.steps.A).if(isA),
      goTo(this.journey.steps.B).if(isB),
      goTo(this.journey.steps.CheckAnswers)
    );
  }
}
class B extends Question {
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class A extends Question {
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, A, B, Branch, CheckAnswers };
const session = {
  entryPoint: Entry.name,
  Branch: { branchControl: 'A' }
};
const req = { session };
const res = {};

const journey = new RequestBoundJourney(req, res, steps, {});

module.exports = { journey, Entry, Branch, A, CheckAnswers };
