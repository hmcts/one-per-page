const { expect } = require('../../util/chai');
const {
  section,
  Section
} = require('../../../src/steps/check-your-answers/section');
const Question = require('../../../src/steps/Question');
const { form } = require('../../../src/forms');
const answer = require('../../../src/steps/check-your-answers/answer');

class TestStep extends Question {
  static get path() {
    return '/test/step';
  }
  get form() {
    return form();
  }
  next() { /* intentionally blank */ }
  answers() {
    return answer(this, { question: 'A test step', answer: 'A test answer' });
  }
}
const completeAnswer = answer({ fields: { valid: true, url: '/good' } });
const incompleteAnswer = answer({ fields: { valid: false, url: '/bad' } });

describe('steps/check-your-answers/section', () => {
  it('returns a Section', () => {
    expect(section('foo')).to.be.an.instanceof(Section);
  });

  it('instaniates the step classes given to it', () => {
    const s = section('foo', { steps: [TestStep] });
    expect(s.steps[0]).to.be.an.instanceof(TestStep);
  });

  describe('#loadFromSession', () => {
    it('sets this.answers to the answers from the listed steps', () => {
      const s = section('foo', { steps: [TestStep] });
      expect(s.answers).to.eql([]);
      s.loadFromSession({ journey: { TestStep } }, {});
      expect(s.answers).to.have.length(1);
      expect(s.answers[0].question).to.eql('A test step');
      expect(s.answers[0].answer).to.eql('A test answer');
    });

    it('filters out answers that are declared for other sections', () => {
      const notThisSection = class extends TestStep {
        answers() {
          return answer(this, { section: 'bar' });
        }
      };
      const s = section('foo', { steps: [notThisSection] });
      s.loadFromSession({ journey: { notThisSection } }, {});
      expect(s.answers).to.eql([]);
    });
  });

  describe('#completedAnswers', () => {
    const s = section('foo');

    it('returns an array of completed answers', () => {
      s.answers = [completeAnswer, incompleteAnswer];
      expect(s.completedAnswers).to.eql([completeAnswer]);
    });

    it('returns [] if no answer complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.completedAnswers).to.eql([]);
    });
  });

  describe('#incomplete', () => {
    const s = section('foo');

    it('returns true if any answers aren\'t complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.incomplete).to.be.true;
    });

    it('returns false if all answers are complete', () => {
      s.answers = [completeAnswer];
      expect(s.incomplete).to.be.false;
    });

    it('returns false if no answers', () => {
      s.answers = [];
      expect(s.incomplete).to.be.false;
    });
  });

  describe('#atLeast1Completed', () => {
    const s = section('foo');

    it('returns true if 1 answer is complete', () => {
      s.answers = [completeAnswer, incompleteAnswer];
      expect(s.atLeast1Completed).to.be.true;
    });

    it('returns false if all answers aren\'t complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.atLeast1Completed).to.be.false;
    });

    it('returns false if no answers', () => {
      s.answers = [];
      expect(s.atLeast1Completed).to.be.false;
    });
  });

  describe('#continueUrl', () => {
    const s = section('foo');

    it('returns the url of the first incomplete step', () => {
      const otherIncomplete = answer({}, { url: '/foo' });
      s.answers = [incompleteAnswer, otherIncomplete];
      expect(s.continueUrl).to.eql(incompleteAnswer.url);

      s.answers = [otherIncomplete, incompleteAnswer];
      expect(s.continueUrl).to.eql(otherIncomplete.url);
    });

    it('returns "" if no answer is incomplete', () => {
      s.answers = [completeAnswer];
      expect(s.continueUrl).to.eql('');
    });

    it('returns "" if no answers given', () => {
      s.answers = [];
      expect(s.continueUrl).to.eql('');
    });
  });
});
