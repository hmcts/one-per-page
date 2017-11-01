const Question = require('../Question');
const { defined } = require('../../util/checks');
const formProxyHandler = require('../../forms/formProxyHandler');

class Section {
  constructor(id, { title, steps = [] } = {}) {
    this.title = title;
    this.id = id;
    this.steps = steps.map(Step => new Step());
    this.answers = [];
  }

  loadFromSession(req, res) {
    this.answers = this.steps
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
      .reduceRight((left, right) => [...left, ...right], [])
      .filter(({ section }) => section === 'any' || section === this.id);
  }

  get completedAnswers() {
    return this.answers.filter(answer => answer.complete);
  }

  get incomplete() {
    return this.answers.some(answer => !answer.complete);
  }

  get atLeast1Completed() {
    return this.answers.some(answer => answer.complete);
  }

  get continueUrl() {
    const nextStep = this.answers.find(answer => !answer.complete);
    return defined(nextStep) ? nextStep.url : '';
  }
}

const section = (...args) => new Section(...args);

module.exports = { Section, section };
