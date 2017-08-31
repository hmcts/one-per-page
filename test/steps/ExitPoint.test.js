const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');
const ExitPoint = require('../../src/steps/ExitPoint');
const { goTo } = require('../../src/services/flow');

describe('steps/ExitPoint', () => {
  it('expects #middleware to be implemented', () => {
    const noMiddlewareDefined = () => new class extends ExitPoint {
      get url() {
        return '/foo';
      }
    }();
    expect(noMiddlewareDefined).to.throw(/ExitPoint must implement middleware/);
  });

  describe('GET', () => {
    const destroySession = (req, res, next) => {
        req.session.destroy();
    }; 
    const exit = new class extends ExitPoint {
      get url() {
        return '/foo';
      }
      get middleware() {
        return [...super.middleware, destroySession];
      }
    }();


    it('destroys a session', () => {
      return testStep(exit)
        .get()
        .session(session => {
          expect(session.active).to.be.false;
        });
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      const fakeStep = { url: '/bar' };
      const exit = new class extends ExitPoint {
        get url() {
          return '/foo';
        }
        
      }();
      return testStep(exit)
        .post()
        .expect(405);
    });
  });
});
