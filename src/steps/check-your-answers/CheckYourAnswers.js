const Page = require('../Page');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const Question = require('../Question');
const formProxyHandler = require('../../forms/formProxyHandler');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

class CheckYourAnswers extends Page {
  constructor() {
    super();
    this._sections = [];
  }

  handler(req, res) {
    const questions = Object.values(this.journey)
      .map(Step => new Step())
      .filter(step => step instanceof Question);

    Promise.all(
      questions.map(question => question
        .ready()
        .then(step => {
          step.req = req;
          step.res = res;
          step.journey = req.journey;

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
}

module.exports = CheckYourAnswers;
