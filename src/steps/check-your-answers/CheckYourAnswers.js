const Page = require('../Page');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const Question = require('../Question');

class CheckYourAnswers extends Page {
  constructor(req, res) {
    super(req, res);
    this._sections = [];
    this.questions = Object.values(this.journey)
      .filter(Step => Step.type === Question.type)
      .map(Step => new Step(req, res));

    this.questions.forEach(step => this.waitFor(step.ready()));
  }

  handler(req, res) {
    this.answers = this.questions
      .map(step => {
        step.fields.retrieve(req);
        const answerOrArr = step.answers();
        return Array.isArray(answerOrArr) ? answerOrArr : [answerOrArr];
      })
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
