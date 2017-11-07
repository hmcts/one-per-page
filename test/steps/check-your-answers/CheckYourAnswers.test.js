const { expect } = require('../../util/chai');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { form, field } = require('../../../src/forms');
const { testStep } = require('../../util/supertest');
const Question = require('../../../src/steps/Question');

describe('steps/CheckYourAnswers', () => {
  it('defines a default #path', () => {
    expect((new CheckYourAnswers()).path).to.eql('/check-your-answers');
  });

  describe('GET', () => {
    it('renders an answer for each answered question in the journey', () => {
      const nameStep = class extends Question {
        get form() {
          return form(field('firstName'), field('lastName'));
        }
        get name() {
          return 'Name';
        }
        next() {
          return this.journey.Gender;
        }
      };
      const genderStep = class extends Question {
        get form() {
          return form(field('gender'));
        }
        get name() {
          return 'Gender';
        }
        next() {
          return this.journey.CheckYourAnswers;
        }
      };
      const journey = { Name: nameStep, Gender: genderStep, CheckYourAnswers };
      const session = {
        Name: { firstName: 'Michael', lastName: 'Allen' },
        Gender: { gender: 'Male' }
      };

      return testStep(new CheckYourAnswers())
        .withSession(session)
        .withSetup(req => {
          req.journey = journey;
        })
        .get()
        .html($ => {
          return Promise.all([
            expect($('#Name .question')).has.$text('Name'),
            expect($('#Name .answer')).has.$text('Michael Allen')
          ]);
        });
    });
  });

  describe('#sections', () => {
    it('defaults to []', () => {
      const cya = new CheckYourAnswers();
      expect(cya.sections()).to.eql([]);
    });
  });

  describe('#noCompletedQuestions', () => {
    const cya = new CheckYourAnswers();
    const incompleteSection = { atLeast1Completed: true };
    const unansweredSection = { atLeast1Completed: false };

    it('returns true if no sections', () => {
      expect(cya.noCompletedQuestions).to.be.true;
    });

    it('returns false if a section has 1 completed question', () => {
      cya._sections = [incompleteSection];
      expect(cya.noCompletedQuestions).to.be.false;
    });

    it('returns true if no sections have 1 completed question', () => {
      cya._sections = [unansweredSection];
      expect(cya.noCompletedQuestions).to.be.true;
    });
  });

  describe('#incomplete', () => {
    const cya = new CheckYourAnswers();
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
    const cya = new CheckYourAnswers();
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
});
