const Question = require('../Question');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const { validateThenStopHere } = require('../../flow');
const { form, bool } = require('../../forms');
const Joi = require('joi');

class CheckYourAnswers extends Question {
  constructor(req, res) {
    super(req, res);
    this._sections = [];
  }

  get middleware() {
    return [...super.middleware, this.journey.collectSteps];
  }

  get errorMessage() {
    return 'Confirm that you agree to the statement of truth';
  }

  get form() {
    return form({
      statementOfTruth: bool.joi(
        this.errorMessage,
        Joi.required().valid(true)
      )
    });
  }

  get flowControl() {
    return validateThenStopHere(this);
  }

  handler(req, res, next) {
    Promise
      .all(this.journey.answers.map(ans => ans.render(req.app)))
      .then(answers => {
        this._sections = [
          ...this.sections().map(s => s.filterAnswers(answers)),
          section.default.filterAnswers(answers)
        ];

        super.handler(req, res, next);
      })
      .catch(error => next(error));
  }

  sections() {
    return [];
  }

  answers() {
    return [];
  }

  get incomplete() {
    return this._sections.some(s => s.incomplete);
  }

  get complete() {
    const hasSections = this._sections.length > 0;
    return hasSections && !this.incomplete;
  }

  get continueUrl() {
    const nextSection = this._sections.find(s => s.incomplete);
    return defined(nextSection) ? nextSection.continueUrl : '';
  }
}

module.exports = CheckYourAnswers;
