const Page = require('../Page');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const Question = require('../Question');
const formProxyHandler = require('../../forms/formProxyHandler');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

class CheckYourAnswers extends Page {
  constructor(req, res) {
    super(req, res);
    this._sections = [];
    this.questions = Object.values(this.journey)
      .filter(Step => Step.type !== CheckYourAnswers.type)
      .map(Step => new Step(req, res))
      .filter(step => step instanceof Question);
    this.questions.forEach(step => this.waitFor(step.ready()));
  }

  handler(req, res) {
    Promise.all(
      this.questions.map(question => question
        .ready()
        .then(step => {
          const form = step.form;
          form.bind(step);
          form.retrieve(req);
          form.validate();
          step.fields = new Proxy(form, formProxyHandler);

          const answerOrArr = step.answers();
          return Array.isArray(answerOrArr) ? answerOrArr : [answerOrArr];
        })
      )
    )
      .then(answers => {
        this.answers = answers
          .reduceRight((left, right) => [...left, ...right], []);

        this._sections = [
          ...this.sections().map(s => s.filterAnswers(this.answers)),
          section.default.filterAnswers(this.answers)
        ];

        super.handler(req, res);
      })
      .catch(error => {
        res.status(INTERNAL_SERVER_ERROR).send(error);
      });
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
