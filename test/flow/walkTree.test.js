const { expect } = require('../util/chai');
const walkTree = require('../../src/flow/walkTree');
const EntryPoint = require('../../src/steps/EntryPoint');
const Question = require('../../src/steps/Question');
const CheckYourAnswers = require('../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { branch, goTo } = require('../../src/flow');
const { textField, form } = require('../../src/forms');
const Joi = require('joi');
const { RequestBoundJourney } = require('../../src/Journey');

describe('flow/walkTree', () => {
  describe('Simple complete journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.steps.Name);
      }
    }
    class Name extends Question {
      get form() {
        return form(textField('firstName'), textField('lastName'));
      }
      next() {
        return goTo(this.journey.steps.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const steps = { Entry, Name, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Name: { firstName: 'Michael', lastName: 'Allen' },
      CheckAnswers: { statementOfTruth: true }
    };
    const res = {};

    it('returns instances of the questions in the order of the flow', () => {
      const req = { session };
      const journey = new RequestBoundJourney(req, res, steps, {});
      req.journey = journey;
      const names = walkTree(journey.instance(Entry), journey)
        .map(s => s.name);
      expect(names).to.eql([Name.name, CheckAnswers.name]);
    });

    it('retrieves and validates any questions', () => {
      const req = { session };
      const journey = new RequestBoundJourney(req, res, steps, {});
      req.journey = journey;
      const valids = walkTree(journey.instance(Entry), journey)
        .map(step => step.fields.valid);
      expect(valids).to.eql([true, true]);
    });
  });

  describe('Simple incomplete journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.steps.Name);
      }
    }
    class Name extends Question {
      get form() {
        return form(textField('notPresent').joi(Joi.string().required()));
      }
      next() {
        return goTo(this.journey.steps.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const steps = { Entry, Name, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Name: {}
    };
    const res = {};

    it('stops on the first incomplete step', () => {
      const req = { session };
      const journey = new RequestBoundJourney(req, res, steps, {});
      req.journey = journey;

      const names = walkTree(journey.instance(Entry), journey).map(s => s.name);
      expect(names).to.eql([Name.name]);
    });
  });

  describe('Branching journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.steps.Branch);
      }
    }
    class Branch extends Question {
      get form() {
        return form(textField('branchControl'));
      }
      next() {
        const isA = this.fields.branchControl.value === 'A';
        const isB = this.fields.branchControl.value === 'B';
        return branch(
          goTo(this.journey.steps.A).if(isA),
          goTo(this.journey.steps.B).if(isB),
          goTo(this.journey.steps.CheckAnswers)
        );
      }
    }
    class B extends Question {
      next() {
        return goTo(this.journey.steps.CheckAnswers);
      }
    }
    class A extends Question {
      next() {
        return goTo(this.journey.steps.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const steps = { Entry, A, B, Branch, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Branch: { branchControl: 'A' }
    };
    const res = {};

    it('skips steps that are not accessed by the flow', () => {
      const req = { session };
      const journey = new RequestBoundJourney(req, res, steps, {});
      req.journey = journey;

      const names = walkTree(journey.instance(Entry), journey).map(s => s.name);
      expect(names).to.eql([Branch.name, A.name, CheckAnswers.name]);
    });
  });

  describe('loop protection', () => {
    {
      class Entry extends EntryPoint {
        next() {
          return goTo(this.journey.steps.A);
        }
      }
      class A extends Question {
        next() {
          return goTo(this.journey.steps.B);
        }
      }
      class B extends Question {
        next() {
          return goTo(this.journey.steps.A);
        }
      }
      class CheckAnswers extends CheckYourAnswers {}
      const steps = { Entry, A, B, CheckAnswers };
      const res = {};

      it('protects against infinite loops', () => {
        const req = { session: {} };
        const journey = new RequestBoundJourney(req, res, steps, {});
        req.journey = journey;

        const tightLoop = () => walkTree(journey.instance(Entry), journey);
        expect(tightLoop).to.throw(/possible infinite loop/);
      });
    }

    {
      class Entry extends EntryPoint {
        next() {
          return goTo(this.journey.steps.A);
        }
      }
      class A extends Question {
        next() {
          return goTo(this.journey.steps.B);
        }
      }
      class B extends Question {
        next() {
          return goTo(this.journey.steps.C);
        }
      }
      class C extends Question {
        next() {
          return goTo(this.journey.steps.A);
        }
      }
      class CheckAnswers extends CheckYourAnswers {}
      const steps = { Entry, A, B, C, CheckAnswers };
      const res = {};

      it('protects against infinite loops', () => {
        const req = { session: {} };
        const journey = new RequestBoundJourney(req, res, steps, {});
        req.journey = journey;

        const looseLoop = () => walkTree(journey.instance(Entry), journey);
        expect(looseLoop).to.throw(/possible infinite loop/);
      });
    }
  });
});
