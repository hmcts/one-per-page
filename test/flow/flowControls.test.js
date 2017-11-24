const { expect } = require('../util/chai');
const Question = require('../../src/steps/Question');
const BaseStep = require('../../src/steps/BaseStep');
const {
  stopHere,
  ifCompleteThenContinue
} = require('../../src/flow/flowControls');
const { form, textField } = require('../../src/forms');
const { goTo } = require('../../src/flow');
const RequestBoundJourney = require('../../src/flow/RequestBoundJourney');
const callsites = require('callsites');

const Step = class extends BaseStep {
  handler() { /* intentionally empty */ }
};

describe('flow/flowControl', () => {
  describe('simple flat flow', () => {
    const A = class extends Question {
      get form() {
        return form(textField('a'));
      }
      get flowControl() {
        return ifCompleteThenContinue(this);
      }
      next() {
        return goTo(this.journey.steps.B);
      }
    };
    const B = class extends Question {
      get form() {
        return form(textField('b'));
      }
      get flowControl() {
        return ifCompleteThenContinue(this);
      }
      next() {
        return goTo(this.journey.steps.C);
      }
    };
    const C = class extends Step {
      get flowControl() {
        return stopHere(this);
      }
    };
    const steps = { A, B, C };
    const req = {
      session: {
        A: { a: 'Step A' },
        B: { b: 'Step B' }
      }
    };
    const res = {};

    it('#walk returns an array of the steps', () => {
      const journey = new RequestBoundJourney(req, res, steps, {});
      const a = journey.instance(A);

      const results = a.flowControl.walk();
      expect(results).to.eql([a, journey.instance(B)]);
    });

    it('#map returns the result of the block you give it', () => {
      const journey = new RequestBoundJourney(req, res, steps, {});
      const a = journey.instance(A);

      const names = a.flowControl.map(step => step.name);
      expect(names).to.eql(['A', 'B']);
    });
  });

  describe('protections', () => {
    {
      const A = class extends Question {
        get form() {
          return form(textField('a'));
        }
        get flowControl() {
          return ifCompleteThenContinue(this);
        }
        next() {
          return goTo(this.journey.steps.B);
        }
      };
      const B = class extends Question {
        get form() {
          return form(textField('b'));
        }
        get flowControl() {
          return ifCompleteThenContinue(this);
        }
        next() {
          return goTo(this.journey.steps.C);
        }
      };
      const C = class extends Question {
        get form() {
          return form(textField('c'));
        }
        get flowControl() {
          return ifCompleteThenContinue(this);
        }
        next() {
          return goTo(this.journey.steps.A);
        }
      };
      const steps = { A, B, C };
      const req = {
        session: {
          A: { a: 'Step A' },
          B: { b: 'Step B' },
          C: { c: 'Step C' }
        }
      };
      const res = {};

      it('protects against infinite loops', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const a = journey.instance(A);

        const looseLoop = () => a.flowControl.walk();
        expect(looseLoop).to.throw(/possible infinite loop/);
      });
    }

    {
      const maxCallStack = 100;
      const steps = [];
      const req = {
        session: { LoopingStep: { a: 'Val from session' } },
        journey: {
          steps,
          instance(stepNo) {
            return steps[stepNo];
          }
        }
      };
      const res = {};
      class LoopingStep extends Question {
        get form() {
          return form(textField('a'));
        }
        get flowControl() {
          return ifCompleteThenContinue(this);
        }
        next() {
          return goTo(this.nextNo);
        }
      }
      steps[0] = new LoopingStep(req, res);
      steps[0].nextNo = 1;

      for (let i = 1; i < maxCallStack; i++) {
        steps[i] = new LoopingStep(req, res);
        steps[i].nextNo = i + 1;
      }
      steps[maxCallStack] = new class extends Question {
        get flowControl() {
          return stopHere(this);
        }
      }(req, res);

      it('reuses stack frames to prevent stack overflow', () => {
        const currentStackSize = callsites().length;
        const stackSizes = steps[0].flowControl
          .map(() => callsites().length)
          .map(realSize => realSize - currentStackSize);
        expect(stackSizes[10]).to.eql(stackSizes[90],
          'call stack size to remain constant'
        );
      });
    }
  });
});
