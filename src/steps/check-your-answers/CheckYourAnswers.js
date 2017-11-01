const Page = require('../Page');
const { section } = require('./section');
const { defined } = require('../../../src/util/checks');
const Question = require('../Question');
const formProxyHandler = require('../../forms/formProxyHandler');

class CheckYourAnswers extends Page {
  constructor() {
    super();
    this._sections = [];
  }

  handler(req, res) {
    this.answers = Object.values(this.journey)
      .map(Step => new Step())
      .filter(step => step instanceof Question)
      .map(step => {
        const fakeReq = Object.assign({}, req, { currentStep: step });
        step.req = fakeReq;
        step.res = res;
        step.journey = req.journey;

        const form = step.form;
        form.retrieve(fakeReq);
        form.validate();
        step.fields = new Proxy(form, formProxyHandler);

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
}

module.exports = CheckYourAnswers;
