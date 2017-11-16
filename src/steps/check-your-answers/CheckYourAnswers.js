const Page = require('../Page');
const { section } = require('./section');
const { defined, ensureArray } = require('../../../src/util/checks');
const Question = require('../Question');
const walkTree = require('../../flow/walkTree');

class CheckYourAnswers extends Page {
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

  get noCompletedQuestions() {
    return this._sections.every(s => !s.atLeast1Completed);
  }

  get incomplete() {
    return this._sections.some(s => s.incomplete);
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
