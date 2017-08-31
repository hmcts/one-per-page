const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');
const ExitPoint = require('../../src/steps/ExitPoint');
const { goTo } = require('../../src/services/flow');

const shouldNotSetCookie = name => {
  return res => Promise.all([
    expect(Object.keys(res.headers)).to.not.include('set-cookie'),
    expect(res.headers['set-cookie']).to.not.include.match(name)
  ]);
};

describe('steps/ExitPoint', () => {
  describe('GET', () => {
    const exit = new class extends ExitPoint {
      get url() {
        return '/foo';
      }
    }();

    it('destroys a session and cookie is not set', () => {
      return testStep(exit)
      .get()
      .expect(200)
      .expect(shouldNotSetCookie(/session/))
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
