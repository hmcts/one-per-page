const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');
const Redirect = require('../../src/steps/Redirect');
const { redirectTo } = require('../../src/flow');

describe('steps/Redirect', () => {
  it('expects #next to be implemented', () => {
    const req = { journey: {} };
    const res = {};
    const noNextDefined = () => new class extends Redirect {}(req, res);
    expect(noNextDefined).to.throw(/Redirect must implement next/);
  });

  describe('GET', () => {
    it('redirects to the step defined in #next', () => {
      const fakeStep = { path: '/bar' };
      const redirect = class extends Redirect {
        next() {
          return redirectTo(fakeStep);
        }
      };
      return testStep(redirect)
        .get()
        .expect('Location', fakeStep.path)
        .expect(302);
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      const fakeStep = { path: '/bar' };
      const redirect = class extends Redirect {
        next() {
          return redirectTo(fakeStep);
        }
      };
      return testStep(redirect)
        .post()
        .expect(405);
    });
  });
});
