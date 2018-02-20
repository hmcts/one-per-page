const { expect } = require('../../util/chai');
const CheckYourAnswers = require('../../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { answer } = require('../../../src/steps/check-your-answers/answer');
const { section } = require('../../../src/steps/check-your-answers/section');
const { form, field } = require('../../../src/forms');
const { goTo } = require('../../../src/flow');
const { testStep } = require('../../util/supertest');
const Question = require('../../../src/steps/Question');
const path = require('path');

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
          return goTo(this.journey.steps.TemplatedAnswer);
        }
      };
      const TemplatedAnswer = class extends Question {
        answers() {
          return answer(this, { template: 'fixtures/templated.answer.html' });
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
      const steps = { Name, Gender, CheckYourAnswers, TemplatedAnswer };
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
        .withViews(path.join(__dirname, './fixtures'))
        .get()
        .html($ => Promise.all([
          expect($('#Name .question')).has.$text('Name'),
          expect($('#Name .answer')).has.$text('Michael Allen'),
          expect($('#TemplatedAnswer .html')).has.$text('Rendered template'),
          expect($('#Gender .question')).has.$text('Your gender'),
          expect($('#Gender .answer')).has.$text('Male')
        ]));
    });

    it('responds with 500 if an answer fails to render', () => {
      const TemplateFails = class extends Question {
        answers() {
          return {
            render() {
              return Promise.reject(new Error('Failed to render'));
            }
          };
        }
        next() {
          return goTo(this.journey.steps.CheckYourAnswers);
        }
      };

      const steps = { TemplateFails, CheckYourAnswers };
      const session = { entryPoint: TemplateFails.name };

      return testStep(CheckYourAnswers)
        .withSession(session)
        .withSetup(req => {
          req.journey.steps = steps;
        })
        .get()
        .expect(500);
    });

    it('sections answers', () => {
      const NoSection = class extends Question {
        answers() {
          return answer(this, { answer: 'Default Answer' });
        }
        next() {
          return goTo(this.journey.steps.Sectioned);
        }
      };
      const Sectioned = class extends Question {
        answers() {
          return answer(this, {
            answer: 'Sectioned Answer',
            section: 'a'
          });
        }
        next() {
          return goTo(this.journey.steps.MultiSectioned);
        }
      };
      const MultiSectioned = class extends Question {
        answers() {
          return [
            answer(this, {
              id: 'multi-1',
              question: 'MultiSection Question 1',
              answer: 'MultiSectioned Answer 1',
              section: 'a'
            }),
            answer(this, {
              id: 'multi-2',
              question: 'MultiSection Question 2',
              answer: 'MultiSectioned Answer 2',
              section: 'b'
            })
          ];
        }
        next() {
          return goTo(this.journey.steps.CYA);
        }
      };
      const CYA = class extends CheckYourAnswers {
        get name() {
          return 'CheckYourAnswers';
        }
        sections() {
          return [
            section('a', { title: 'Section A' }),
            section('b', { title: 'Section B' })
          ];
        }
      };

      const steps = { NoSection, Sectioned, MultiSectioned, CYA };
      const session = { entryPoint: NoSection.name };

      return testStep(CYA)
        .withSession(session)
        .withSetup(req => {
          req.journey.steps = steps;
        })
        .withViews(path.join(__dirname, './fixtures'))
        .get()
        .html($ => Promise.all([
          expect($('#a #Sectioned .answer')).has.$text('Sectioned Answer'),
          expect($('#a #multi-1 .answer')).has.$text('MultiSectioned Answer 1'),
          expect($('#b #multi-2 .answer')).has.$text('MultiSectioned Answer 2'),
          expect($('#default #NoSection .answer')).has.$text('Default Answer')
        ]));
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
