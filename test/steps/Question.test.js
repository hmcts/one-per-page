const { expect, sinon } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Question = require('../../src/steps/Question');
const { section } = require('../../src/steps/check-your-answers/section');
const formProxyHandler = require('../../src/forms/formProxyHandler');
const { NotImplemented } = require('../../src/errors/expectImplemented');
const { field, form } = require('../../src/forms');
const { goTo } = require('../../src/flow');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');

describe('steps/Question', () => {
  {
    const unimplementedQuestion = () => {
      return new class extends Question {}();
    };

    it('expects form to be implemented', () => {
      return expect(unimplementedQuestion)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('form');
    });

    it('expects next to be implemented', () => {
      return expect(unimplementedQuestion)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('next');
    });
  }

  {
    const SimpleQuestion = class extends Question {
      get form() {
        return form(field('name'));
      }
      get template() {
        return 'question_views/simpleQuestion';
      }

      next() {
        return goTo({ path: '/next-step' });
      }
    };

    const question = new SimpleQuestion();

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
            req.session.SimpleQuestion_name = 'Michael Allen';
          })
          .get()
          .html($ => {
            expect($('#SimpleQuestion_name')).to.contain.$val('Michael Allen');
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
          expect(session).to.contain.key('SimpleQuestion_name');
        });
      });

      it('redirects to the next step', () => {
        return postRequest.expect(302).expect('Location', '/next-step');
      });

      describe('is invalid', () => {
        const errorMessage = 'Error message';
        const returnIsInvalid = sinon.stub().returns(errorMessage);
        const InvalidQuestion = class extends SimpleQuestion {
          get form() {
            return form(
              field('name').validate(returnIsInvalid)
            );
          }
        };
        const invalidQuestion = new InvalidQuestion();

        it('renders step with error message', () => {
          return testStep(invalidQuestion)
            .withSetup(req => req.session.generate())
            .withField('name', 'Invalid Answer')
            .post()
            .html($ => {
              return expect($('.error-message')).to.contain.$text(errorMessage);
            });
        });
      });

      describe('is valid', () => {
        const returnIsValid = sinon.stub().returns();
        const ValidQuestion = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form(
              field('name').validate(returnIsValid)
            );
          }
        };
        const validQuestion = new ValidQuestion();

        it('redirects to the next step if valid', () => {
          const response = testStep(validQuestion)
            .withSetup(req => req.session.generate())
            .withField('name', 'valid answer')
            .post();
          return response.expect(302).expect('Location', '/next-step');
        });
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

    describe('#answers', () => {
      it('returns a default answer', () => {
        const NameStep = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form(
              field('name')
            );
          }
        };
        const step = new NameStep();
        const _form = step.form;
        _form.retrieve({
          currentStep: step,
          session: { NameStep_name: 'John' }
        });
        _form.validate();
        step.fields = new Proxy(_form, formProxyHandler);

        const _answers = step.answers();
        expect(_answers).to.be.an('object');
        expect(_answers).to.have.property('url', '/next-step');
        expect(_answers).to.have.property('question', 'Name step');
        expect(_answers).to.have.property('value').that.eql({ name: 'John' });
        expect(_answers).to.have.property('answer', 'John');
        expect(_answers).to.have.property('section', section.default.id);
        expect(_answers).to.have.property('complete', true);
      });
    });
  }
});
