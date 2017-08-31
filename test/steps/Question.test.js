const { expect } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Question = require('../../src/steps/Question');
const { NotImplemented } = require('../../src/errors/expectImplemented');
const { field, form } = require('../../src/services/fields');
const { goTo } = require('../../src/services/flow');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

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
      get form() {
        return form(field('name'));
      }
      get url() {
        return '/question-1';
      }
      get template() {
        return 'question_views/simpleQuestion';
      }

      next() {
        return goTo({ url: '/next-step' });
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

      it('loads fields from the session', () => {
        return testStep(question)
          .withSetup(req => {
            req.session.generate();
            req.session.Question_name = 'Michael Allen';
          })
          .get()
          .html($ => {
            expect($('#Question_name')).to.contain.$val('Michael Allen');
          });
      });
    });

    describe('POST', () => {
      const postRequest = testStep(question)
        .withSetup(req => req.session.generate())
        .withField('name', 'Michael Allen')
        .post();

      it('saves answers in the session', () => {
        return postRequest.session(session => {
          expect(session).to.contain.key('Question_name');
        });
      });

      it('redirects to the next step', () => {
        return postRequest.expect(302).expect('Location', '/next-step');
      });
    });

    const notAllowedMethods = ['put', 'delete', 'patch'];

    notAllowedMethods.forEach(method => {
      describe(method.toUpperCase(), () => {
        it('returns 405 (METHOD_NOT_ALLOWED)', () => {
          return testStep(question)
            .withSetup(req => req.session.generate())
            .withField('name', 'Michael Allen')
            .execute(method)
            .expect(METHOD_NOT_ALLOWED);
        });
      });
    });
  }
});
