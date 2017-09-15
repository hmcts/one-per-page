const { testStep, shouldNotSetCookie } = require('../util/supertest');
const ExitPoint = require('../../src/steps/ExitPoint');

describe('steps/ExitPoint', () => {
  describe('GET', () => {
    const exit = new class extends ExitPoint {
      get url() {
        return '/foo';
      }
    }();

    it.skip('destroys a session and cookie is not set', () => {
      return testStep(exit)
        .get()
        .expect(200)
        .expect(shouldNotSetCookie(/session/));
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
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
