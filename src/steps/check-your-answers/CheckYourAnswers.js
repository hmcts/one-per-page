const Question = require('../Question');
const { section } = require('./section');
const { defined, ensureArray } = require('../../../src/util/checks');
const { validateThenStopHere } = require('../../flow');
const { form, boolField } = require('../../forms');
const Joi = require('joi');

class CheckYourAnswers extends Question {
  constructor(req, res) {
    super(req, res);
    this._sections = [];
  }

  get middleware() {
    return [this.collectSteps, ...super.middleware];
  }

  collectSteps(req, res, next) {
    this.steps = this.journey.walkTree();
    this.steps.forEach(step => this.waitFor(step.ready()));
    next();
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
    this._answers = this.steps
      .filter(step => step instanceof Question)
      .map(step => ensureArray(step.answers()))
      .reduce((left, right) => [...left, ...right], []);
    this._sections = [
      ...this.sections().map(s => s.filterAnswers(this._answers)),
      section.default.filterAnswers(this._answers)
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
