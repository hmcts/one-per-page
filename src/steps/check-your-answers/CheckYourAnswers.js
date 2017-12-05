const Question = require('../Question');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const { validateThenStopHere } = require('../../flow');
const { form, boolField } = require('../../forms');
const Joi = require('joi');

class CheckYourAnswers extends Question {
  constructor(req, res) {
    super(req, res);
    this._sections = [];
  }

  get middleware() {
    return [this.journey.collectSteps, ...super.middleware];
  }

  get errorMessage() {
    return 'Confirm that you agree to the statement of truth';
  }

  get form() {
    return form(
      boolField('statementOfTruth').joi(
        this.errorMessage,
        Joi.required().valid(true)
      )
    );
  }

  get flowControl() {
    return validateThenStopHere(this);
  }

  handler(req, res) {
    const answers = this.journey.answers;
    this._sections = [
      ...this.sections().map(s => s.filterAnswers(answers)),
      section.default.filterAnswers(answers)
    ];

    super.handler(req, res);
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
