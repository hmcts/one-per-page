const { expect, sinon } = require('../util/chai');
const { testStep } = require('../util/supertest');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const Action = require('../../src/steps/Action');
const { branch, goTo } = require('../../src/flow');

describe.only('steps/Action', () => {
  describe('GET', () => {
    {
      const nextStep = { path: '/foo' };
      const actionSpy = sinon.spy();
      const action = class extends Action {
        action() {
          actionSpy();
        }
        next() {
          return goTo(nextStep);
        }
      };

      beforeEach(() => {
        actionSpy.reset();
      });

      it('executes #action', () => {
        return testStep(action)
          .get()
          .then(() => {
            expect(actionSpy).calledOnce;
          });
      });

      it('waits for long running actions to complete', () => {
        const longRunningAction = class extends action {
          action() {
            return new Promise(resolve => {
              setTimeout(() => {
                actionSpy();
                resolve();
              }, 10);
            });
          }
        };
        return testStep(longRunningAction)
          .get()
          .then(() => expect(actionSpy).calledOnce);
      });

      it('redirects to #next', () => {
        return testStep(action)
          .get()
          .expect('Location', nextStep.path);
      });

      it('redirects to #next even if action rejects', () => {
        const failingAction = class extends action {
          action() {
            return Promise.reject(new Error('I failed'));
          }
        };
        return testStep(failingAction)
          .get()
          .expect('Location', nextStep.path);
      });

      it('redirects to #next even if action throws', () => {
        const failingAction = class extends action {
          action() {
            throw new Error('I failed');
          }
        };
        return testStep(failingAction)
          .get()
          .expect('Location', nextStep.path);
      });
    }

    describe('#success', () => {
      const success = { path: '/all/good' };
      const failed = { path: '/something/broke' };
      const fallback = { path: '/shouldnt/happen' };

      const successfulAction = class extends Action {
        next() {
          return branch(
            goTo(success).if(this.success),
            goTo(failed).if(() => !this.success),
            goTo(fallback)
          );
        }
      };
      const rejectingAction = class extends successfulAction {
        action() {
          return Promise.reject(new Error('I failed'));
        }
      };
      const throwingAction = class extends successfulAction {
        action() {
          throw new Error('I failed');
        }
      };

      it('returns true if action resolved', () => {
        return testStep(successfulAction)
          .get()
          .expect('Location', success.path);
      });

      it('returns false if action threw', () => {
        return testStep(throwingAction)
          .get()
          .expect('Location', failed.path);
      });

      it('returns false if action rejected', () => {
        return testStep(rejectingAction)
          .get()
          .expect('Location', failed.path);
      });
    });

    describe('#failed', () => {
      const success = { path: '/all/good' };
      const failed = { path: '/something/broke' };
      const fallback = { path: '/shouldnt/happen' };

      const successfulAction = class extends Action {
        next() {
          return branch(
            goTo(failed).if(this.failed),
            goTo(success).if(() => !this.failed),
            goTo(fallback)
          );
        }
      };
      const rejectingAction = class extends successfulAction {
        action() {
          return Promise.reject(new Error('I failed'));
        }
      };
      const throwingAction = class extends successfulAction {
        action() {
          throw new Error('I failed');
        }
      };

      it('returns true if action resolved', () => {
        return testStep(successfulAction)
          .get()
          .expect('Location', success.path);
      });

      it('returns false if action threw', () => {
        return testStep(throwingAction)
          .get()
          .expect('Location', failed.path);
      });

      it('returns false if action rejected', () => {
        return testStep(rejectingAction)
          .get()
          .expect('Location', failed.path);
      });
    });
  });

  describe('POST', () => {
    it('returns 405 method not allowed', () => {
      const action = class extends Action {};
      return testStep(action).post().expect(METHOD_NOT_ALLOWED);
    });
  });
});
