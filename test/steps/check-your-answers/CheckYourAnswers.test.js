const { expect } = require('../../util/chai');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len

describe('steps/CheckYourAnswers', () => {
  it('defines a default #path', () => {
    expect((new CheckYourAnswers()).path).to.eql('/check-your-answers');
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
