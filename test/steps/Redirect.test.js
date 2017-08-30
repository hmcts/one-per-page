const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');
const Redirect = require('../../src/steps/Redirect');
const { goTo } = require('../../src/services/flow');

describe('steps/Redirect', () => {
  it('expects #next to be implemented', () => {
    const noNextDefined = () => new class extends Redirect {
      get url() {
        return '/foo';
      }
    }();
    expect(noNextDefined).to.throw(/Redirect must implement next/);
  });

  describe('GET', () => {
    it('redirects to the step defined in #next', () => {
      const fakeStep = { url: '/bar' };
      const redirect = new class extends Redirect {
        get url() {
          return '/foo';
        }
        next() {
          return goTo(fakeStep);
        }
      }();
      return testStep(redirect)
        .get()
        .expect('Location', fakeStep.url)
        .expect(302);
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      const fakeStep = { url: '/bar' };
      const redirect = new class extends Redirect {
        get url() {
          return '/foo';
        }
        next() {
          return goTo(fakeStep);
        }
      }();
      return testStep(redirect)
        .post()
        .expect(405);
    });
  });
});
