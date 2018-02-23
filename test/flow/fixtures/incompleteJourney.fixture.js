const EntryPoint = require('../../../src/steps/EntryPoint');
const Question = require('../../../src/steps/Question');
const { text, form } = require('../../../src/forms');
const { goTo, RequestBoundJourney } = require('../../../src/flow');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const Joi = require('joi');

class Entry extends EntryPoint {
  next() {
    return goTo(this.journey.steps.Name);
  }
}
class Name extends Question {
  get form() {
    return form({ notPresent: text.joi('required', Joi.string().required()) });
  }
  next() {
    return goTo(this.journey.steps.CheckAnswers);
  }
}
class CheckAnswers extends CheckYourAnswers {}
const steps = { Entry, Name, CheckAnswers };
const session = {
  entryPoint: Entry.name,
  Name: {}
};
const req = { session };
const res = {};

const journey = new RequestBoundJourney(req, res, steps, {});

module.exports = { journey, Entry, Name };
