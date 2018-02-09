const { expect } = require('../../util/chai');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { answer } = require('../../../src/steps/check-your-answers/answer');
const { form, field } = require('../../../src/forms');
const { goTo } = require('../../../src/flow');
const { testStep } = require('../../util/supertest');
const Question = require('../../../src/steps/Question');

describe('steps/CheckYourAnswers', () => {
  it('defines a default #path', () => {
    const req = { journey: {} };
    const res = {};
    expect((new CheckYourAnswers(req, res)).path).to.eql('/check-your-answers');
  });

  describe('GET', () => {
    it('renders an answer for each answered question in the journey', () => {
      const Name = class extends Question {
        get form() {
          return form(field('firstName'), field('lastName'));
        }
        next() {
          return goTo(this.journey.steps.Gender);
        }
      };
      const Gender = class extends Question {
        get form() {
          return form(field('gender'));
        }
        answers() {
          return answer(this, { question: 'Your gender' });
        }
        next() {
          return goTo(this.journey.steps.CheckYourAnswers);
        }
      };
      const steps = { Name, Gender, CheckYourAnswers };
      const session = {
        entryPoint: Name.name,
        Name: { firstName: 'Michael', lastName: 'Allen' },
        Gender: { gender: 'Male' }
      };

      return testStep(CheckYourAnswers)
        .withSession(session)
        .withSetup(req => {
          req.journey.steps = steps;
        })
        .get()
        .html($ => {
          return Promise.all([
            expect($('#Name .question')).has.$text('Name'),
            expect($('#Name .answer')).has.$text('Michael Allen'),
            expect($('#Gender .question')).has.$text('Your gender'),
            expect($('#Gender .answer')).has.$text('Male')
          ]);
        });
    });
  });

  describe('#sections', () => {
    it('defaults to []', () => {
      const req = { journey: {} };
      const res = {};
      const cya = new CheckYourAnswers(req, res);
      expect(cya.sections()).to.eql([]);
    });
  });

  describe('#complete', () => {
    const req = { journey: {} };
    const res = {};
    const cya = new CheckYourAnswers(req, res);
    const completeSection = { incomplete: false };
    const incompleteSection = { incomplete: true };

    it('returns false if no sections', () => {
      // At least 1 section is expected in a journey
      expect(cya.complete).to.be.false;
    });

    it('returns true if all sections are complete', () => {
      cya._sections = [completeSection];
      expect(cya.complete).to.be.true;
    });

    it('returns false if any section is incomplete', () => {
      cya._sections = [completeSection, incompleteSection];
      expect(cya.complete).to.be.false;
    });
  });

  describe('#incomplete', () => {
    const req = { journey: {} };
    const res = {};
    const cya = new CheckYourAnswers(req, res);
    const incompleteSection = { incomplete: true };
    const completeSection = { incomplete: false };

    it('returns false if no sections', () => {
      expect(cya.incomplete).to.be.false;
    });

    it('returns true if any section is incomplete', () => {
      cya._sections = [incompleteSection, completeSection];
      expect(cya.incomplete).to.be.true;
    });

    it('returns false if all sections are complete', () => {
      cya._sections = [completeSection];
      expect(cya.incomplete).to.be.false;
    });
  });

  describe('#continueUrl', () => {
    const req = { journey: {} };
    const res = {};
    const cya = new CheckYourAnswers(req, res);
    const incompleteSection = { incomplete: true, continueUrl: '/incomplete' };
    const completeSection = { incomplete: false, continueUrl: '/complete' };

    it('returns the "" if no sections', () => {
      cya._sections = [];
      expect(cya.continueUrl).to.eql('');
    });

    it('returns the "" if all sections are complete', () => {
      cya._sections = [completeSection];
      expect(cya.continueUrl).to.eql('');
    });

    it('returns the continueUrl of the first incomplete section', () => {
      cya._sections = [completeSection, incompleteSection];
      expect(cya.continueUrl).to.eql(incompleteSection.continueUrl);
    });
  });

  describe('#valid', () => {
    const req = { journey: {} };
    const res = {};

    it('returns false if no statementOfTruth set', () => {
      return new CheckYourAnswers(req, res).ready().then(cya => {
        cya.parse();
        cya.validate();
        expect(cya.valid).to.be.false;
      });
    });
  });
});
