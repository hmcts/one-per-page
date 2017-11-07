const { testStep, shouldNotSetCookie } = require('../util/supertest');
const ExitPoint = require('../../src/steps/ExitPoint');

describe('steps/ExitPoint', () => {
  describe('GET', () => {
    it('destroys a session and cookie is not set', () => {
      return testStep(ExitPoint)
        .get()
        .expect(200)
        .expect(shouldNotSetCookie(/session/));
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      return testStep(ExitPoint)
        .post()
        .expect(405);
    });
  });
});
