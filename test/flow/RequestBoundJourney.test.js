const { expect, sinon } = require('../util/chai');
const BaseStep = require('../../src/steps/BaseStep');
const EntryPoint = require('../../src/steps/EntryPoint');
const Question = require('../../src/steps/Question');
const CheckYourAnswers = require('../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { branch, goTo, RequestBoundJourney } = require('../../src/flow');
const { textField, form } = require('../../src/forms');
const Joi = require('joi');

describe('journey/RequestBoundJourney', () => {
  it('sets itself to req.journey', () => {
    const req = {};
    const res = {}, steps = {}, settings = {};
    const journey = new RequestBoundJourney(req, res, steps, settings);
    expect(req.journey).to.eql(journey);
  });

  describe('#instance', () => {
    const Step = class extends BaseStep {
      handler(/* req, res */) { /* intentionally blank */ }
    };
    const req = {};
    const res = {};
    const steps = { Step };
    const settings = {};

    it('returns an instance of the given step', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      expect(journey.instance('Step')).an.instanceof(Step);
    });

    it('accepts a Step class', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      expect(journey.instance(Step)).an.instanceof(Step);
    });

    it('throws if given a Step that hasn\'t been registered', () => {
      const UnknownStep = class extends BaseStep {
        handler(/* req, res */) { /* intentionally blank */ }
      };
      const journey = new RequestBoundJourney(req, res, steps, settings);
      const creatingUnknownStep = () => journey.instance(UnknownStep);

      expect(creatingUnknownStep).to.throw(/UnknownStep not registered/);
    });

    it('throws if given an object that isn\'t a step', () => {
      const journey = new RequestBoundJourney(req, res, steps, settings);
      const arbitraryObj = () => journey.instance({});

      expect(arbitraryObj).to.throw(/is not a step/);
    });
  });

  describe('#walkTree', () => {
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
      const req = { session };

      it('returns instances of the questions in the order of the flow', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const names = journey.walkTree().map(s => s.name);

        expect(names).to.eql([Entry.name, Name.name, CheckAnswers.name]);
      });

      it('retrieves and validates any questions', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const valids = journey.walkTree()
          .filter(step => step instanceof Question)
          .map(step => step.fields.valid);

        expect(valids).to.eql([true, true]);
      });
    });

    describe('#collectSteps', () => {
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
      const req = {
        session,
        currentStep: { waitFor: sinon.stub() }
      };
      const res = {};
      const next = sinon.stub();
      const journey = new RequestBoundJourney(req, res, steps, {});

      before(() => {
        sinon.spy(journey, 'walkTree');
        journey.collectSteps(req, res, next);
      });

      it('walks the tree', () => {
        expect(journey.walkTree).calledOnce;
      });

      it('sets #visitedSteps to the steps used in the journey', () => {
        const expectedSteps = [journey.instance(Entry), journey.instance(Name)];
        expect(journey.visitedSteps).to.eql(expectedSteps);
      });

      it('makes the current step to wait for the steps to be ready', () => {
        expect(req.currentStep.waitFor).calledTwice;
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
      const req = { session };
      const res = {};

      it('stops on the first incomplete step', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const names = journey.walkTree().map(s => s.name);
        expect(names).to.eql([Entry.name, Name.name]);
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
      const req = { session };
      const res = {};

      it('skips steps that are not accessed by the flow', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const names = journey.walkTree().map(s => s.name);
        expect(names).to.eql([
          Entry.name,
          Branch.name,
          A.name,
          CheckAnswers.name
        ]);
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
        const req = { session: { entryPoint: Entry.name } };
        const res = {};

        it('protects against infinite loops', () => {
          const journey = new RequestBoundJourney(req, res, steps, {});
          const tightLoop = () => journey.walkTree();
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
        const req = { session: { entryPoint: Entry.name } };
        const res = {};

        it('protects against infinite loops', () => {
          const journey = new RequestBoundJourney(req, res, steps, {});
          const looseLoop = () => journey.walkTree();
          expect(looseLoop).to.throw(/possible infinite loop/);
        });
      }
    });
  });
});
