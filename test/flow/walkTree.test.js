const { expect } = require('../util/chai');
const walkTree = require('../../src/flow/walkTree');
const EntryPoint = require('../../src/steps/EntryPoint');
const Question = require('../../src/steps/Question');
const CheckYourAnswers = require('../../src/steps/check-your-answers/CheckYourAnswers'); // eslint-disable-line max-len
const { branch, goTo } = require('../../src/flow');
const { textField, form } = require('../../src/forms');
const Joi = require('joi');

describe('flow/walkTree', () => {
  describe('Simple complete journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.Name);
      }
    }
    class Name extends Question {
      get form() {
        return form(textField('firstName'), textField('lastName'));
      }
      next() {
        return goTo(this.journey.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const journey = { Entry, Name, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Name: { firstName: 'Michael', lastName: 'Allen' }
    };
    const req = { journey, session };
    const res = {};

    it('returns instances of the steps in the order of the flow', () => {
      const steps = {
        Entry: new Entry(req, res),
        Name: new Name(req, res),
        CheckAnswers: new CheckAnswers(req, res)
      };

      return steps.CheckAnswers.ready().then(() => {
        const names = walkTree(steps.Entry, steps).map(s => s.name);
        expect(names).to.eql([Entry.name, Name.name, CheckAnswers.name]);
      });
    });

    it('retrieves and validates any questions', () => {
      const steps = {
        Entry: new Entry(req, res),
        Name: new Name(req, res),
        CheckAnswers: new CheckAnswers(req, res)
      };

      return steps.CheckAnswers.ready().then(() => {
        const valids = walkTree(steps.Entry, steps)
          .filter(step => step instanceof Question)
          .map(step => step.fields.valid);
        expect(valids).to.eql([true]);
      });
    });
  });

  describe('Simple incomplete journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.Name);
      }
    }
    class Name extends Question {
      get form() {
        return form(textField('notPresent').joi(Joi.string().required()));
      }
      next() {
        return goTo(this.journey.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const journey = { Entry, Name, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Name: {}
    };
    const req = { journey, session };
    const res = {};

    it('stops on the first incomplete step', () => {
      const steps = {
        Entry: new Entry(req, res),
        Name: new Name(req, res),
        CheckAnswers: new CheckAnswers(req, res)
      };

      return steps.CheckAnswers.ready().then(() => {
        const names = walkTree(steps.Entry, steps).map(s => s.name);
        expect(names).to.eql([Entry.name, Name.name]);
      });
    });
  });

  describe('Branching journey', () => {
    class Entry extends EntryPoint {
      next() {
        return goTo(this.journey.Branch);
      }
    }
    class Branch extends Question {
      get form() {
        return form(textField('branchControl'));
      }
      next() {
        return branch(
          goTo(this.journey.A).if(this.fields.branchControl.value === 'A'),
          goTo(this.journey.B).if(this.fields.branchControl.value === 'B'),
          goTo(this.journey.CheckAnswers)
        );
      }
    }
    class B extends Question {
      next() {
        return goTo(this.journey.CheckAnswers);
      }
    }
    class A extends Question {
      next() {
        return goTo(this.journey.CheckAnswers);
      }
    }
    class CheckAnswers extends CheckYourAnswers {}
    const journey = { Entry, A, B, Branch, CheckAnswers };
    const session = {
      entryPoint: Entry.name,
      Branch: { branchControl: 'A' }
    };
    const req = { journey, session };
    const res = {};

    it('skips steps that are not accessed by the flow', () => {
      const steps = {
        Entry: new Entry(req, res),
        Branch: new Branch(req, res),
        A: new A(req, res),
        B: new B(req, res),
        CheckAnswers: new CheckAnswers(req, res)
      };

      return steps.CheckAnswers.ready().then(() => {
        const names = walkTree(steps.Entry, steps).map(s => s.name);
        expect(names).to.eql(
          [Entry.name, Branch.name, A.name, CheckAnswers.name]
        );
      });
    });
  });

  describe('loop protection', () => {
    {
      class Entry extends EntryPoint {
        next() {
          return goTo(this.journey.A);
        }
      }
      class A extends Question {
        next() {
          return goTo(this.journey.B);
        }
      }
      class B extends Question {
        next() {
          return goTo(this.journey.A);
        }
      }
      class CheckAnswers extends CheckYourAnswers {}
      const journey = { Entry, A, B, CheckAnswers };
      const req = { journey, session: {} };
      const res = {};

      it('protects against infinite loops', () => {
        const steps = {
          Entry: new Entry(req, res),
          A: new A(req, res),
          B: new B(req, res),
          CheckAnswers: new CheckAnswers(req, res)
        };

        return steps.CheckAnswers.ready().then(() => {
          const tightLoop = () => walkTree(steps.Entry, steps);
          expect(tightLoop).to.throw(/possible infinite loop/);
        });
      });
    }

    {
      class Entry extends EntryPoint {
        next() {
          return goTo(this.journey.A);
        }
      }
      class A extends Question {
        next() {
          return goTo(this.journey.B);
        }
      }
      class B extends Question {
        next() {
          return goTo(this.journey.C);
        }
      }
      class C extends Question {
        next() {
          return goTo(this.journey.A);
        }
      }
      class CheckAnswers extends CheckYourAnswers {}
      const journey = { Entry, A, B, C, CheckAnswers };
      const req = { journey, session: {} };
      const res = {};

      it('protects against infinite loops', () => {
        const steps = {
          Entry: new Entry(req, res),
          A: new A(req, res),
          B: new B(req, res),
          C: new C(req, res),
          CheckAnswers: new CheckAnswers(req, res)
        };

        return steps.CheckAnswers.ready().then(() => {
          const looseLoop = () => walkTree(steps.Entry, steps);
          expect(looseLoop).to.throw(/possible infinite loop/);
        });
      });
    }
  });
});
