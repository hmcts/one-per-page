const { expect, sinon } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Question = require('../../src/steps/Question');
const { section } = require('../../src/steps/check-your-answers/section');
const formProxyHandler = require('../../src/forms/formProxyHandler');
const { NotImplemented } = require('../../src/errors/expectImplemented');
const { field, form } = require('../../src/forms');
const { goTo } = require('../../src/flow');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const Joi = require('joi');

describe('steps/Question', () => {
  {
    const unimplementedQuestion = () => {
      const req = { journey: {} };
      const res = {};
      return new class extends Question {}(req, res);
    };

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

    describe('GET', () => {
      it('renders the page on GET', () => {
        return testStep(SimpleQuestion)
          .withSetup(req => req.session.generate())
          .get()
          .html($ => {
            return expect($('h1')).to.contain.$text('Question 1');
          });
      });

      it('loads fields from the session', () => {
        return testStep(SimpleQuestion)
          .withSetup(req => {
            req.session.generate();
            req.session.SimpleQuestion = { name: 'Michael Allen' };
          })
          .get()
          .html($ => {
            return expect($('#name')).has.$val('Michael Allen');
          });
      });
    });

    describe('POST', () => {
      const postRequest = testStep(SimpleQuestion)
        .withSetup(req => req.session.generate())
        .withField('name', 'Michael Allen')
        .post();

      it('saves answers in the session', () => {
        return postRequest.session(session => {
          expect(session).to.contain.key('SimpleQuestion');
          expect(session.SimpleQuestion).to.contain.key('name');
          expect(session.SimpleQuestion.name).to.eql('Michael Allen');
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
        it('renders step with error message', () => {
          return testStep(InvalidQuestion)
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

        it('redirects to the next step if valid', () => {
          const response = testStep(ValidQuestion)
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
          return testStep(SimpleQuestion)
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
        const req = {
          journey: {},
          session: { NameStep: { name: 'John' } }
        };
        const res = {};
        const step = new NameStep(req, res);
        step.retrieve().validate();

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

  {
    const NameStep = class extends Question {
      static get path() {
        return '/name';
      }

      get form() {
        return form(
          field('name').joi(Joi.string().required())
        );
      }

      template() { /* intentionally blank */ }
      next() { /* intentionally blank */ }
    };

    describe('#retrieve', () => {
      it('calls fields.retrieve with the bound request', () => {
        const req = {
          journey: { NameStep },
          session: { NameStep: { name: 'Michael' } }
        };
        const step = new NameStep(req, {});
        step.retrieve();
        expect(step.fields.name.value).to.eql('Michael');
      });
    });

    describe('#parse', () => {
      it('calls fields.parse with the bound request', () => {
        const req = {
          journey: { NameStep },
          body: { name: 'Michael' }
        };
        const step = new NameStep(req, {});
        step.parse();
        expect(step.fields.name.value).to.eql('Michael');
      });
    });

    describe('#store', () => {
      it('calls fields.store with the bound request', () => {
        const req = {
          journey: { NameStep },
          session: {}
        };
        const step = new NameStep(req, {});
        step.fields.name.value = 'Michael';
        step.store();
        expect(req.session.NameStep.name).to.eql('Michael');
      });
    });

    describe('#validate', () => {
      it('validates the questions fields', () => {
        const step = new NameStep({}, {});
        step.fields.name.value = 'Michael';

        expect(step.fields.validated).to.be.false;
        step.validate();
        expect(step.fields.validated).to.be.true;
      });
    });

    describe('#valid', () => {
      it('returns true if the questions fields are valid', () => {
        const step = new NameStep({}, {});
        step.fields.name.value = 'Michael';
        step.validate();
        expect(step.valid).to.be.true;
      });

      it('returns false if the questions fields are invalid', () => {
        const step = new NameStep({}, {});
        step.validate();
        expect(step.valid).to.be.false;
      });
    });
  }
});
