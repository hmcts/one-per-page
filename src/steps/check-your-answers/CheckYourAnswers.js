const Question = require('../Question');
const { section } = require('./section');
const { defined, ensureArray } = require('../../../src/util/checks');
const { walkTree, stop } = require('../../flow');
const { form, boolField } = require('../../forms');
const Joi = require('joi');

class CheckYourAnswers extends Question {
  constructor(req, res) {
    super(req, res);
    this._sections = [];

    if (defined(this.req.session) && defined(this.req.session.entryPoint)) {
      const Entry = this.journey[this.req.session.entryPoint];

      const steps = Object.keys(this.journey)
        .filter(name => name !== this.name)
        .map(name => this.journey[name])
        .map(Step => new Step(req, res))
        .reduce((obj, step) => Object.assign(obj, { [step.name]: step }), {});
      steps[this.name] = this;

      this.questions = walkTree(steps[Entry.name], steps)
        .filter(step => step instanceof Question);
    } else {
      this.questions = [];
    }

    this.questions.forEach(step => this.waitFor(step.ready()));
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

  next() {
    return stop(this);
  }

  handler(req, res) {
    this.answers = this.questions
      .map(step => ensureArray(step.answers()))
      .reduceRight((left, right) => [...left, ...right], []);
    this._sections = [
      ...this.sections().map(s => s.filterAnswers(this.answers)),
      section.default.filterAnswers(this.answers)
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

  static get type() {
    return 'CheckYourAnswers';
  }
}

module.exports = CheckYourAnswers;
