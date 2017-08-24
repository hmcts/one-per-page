const { expect } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Question = require('../../src/steps/Question');
const { NotImplemented } = require('../../src/errors/expectImplemented');

describe('steps/Question', () => {
  {
    const unimplementedQuestion = () => {
      return new class extends Question {}();
    };

    it('expects url to be implemented', () => {
      return expect(unimplementedQuestion)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('url');
    });
  }

  {
    const question = new class extends Question {
      get url() {
        return '/question-1';
      }
      get template() {
        return 'question_views/simpleQuestion';
      }
    }();

    describe('GET', () => {
      it('renders the page on GET', () => {
        return testStep(question)
          .withSetup(req => req.session.generate())
          .get()
          .html($ => {
            return expect($('h1')).to.contain.$text('Question 1');
          });
      });
    });
  }
});
