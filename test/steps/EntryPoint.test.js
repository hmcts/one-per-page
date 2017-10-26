const { testStep } = require('../util/supertest');
const { expect } = require('../util/chai');
const EntryPoint = require('../../src/steps/EntryPoint');
const { goTo } = require('../../src/flow');

describe('steps/EntryPoint', () => {
  it('expects #next to be implemented', () => {
    const noNextDefined = () => new class extends EntryPoint {}();
    expect(noNextDefined).to.throw(/EntryPoint must implement next/);
  });

  describe('GET', () => {
    const fakeStep = { path: '/bar' };
    const redirect = new class extends EntryPoint {
      next() {
        return goTo(fakeStep);
      }
    }();

    it('redirects to the step defined in #next', () => {
      return testStep(redirect)
        .get()
        .expect('Location', fakeStep.path)
        .expect(302);
    });

    it('creates a session', () => {
      return testStep(redirect)
        .get()
        .session(session => {
          expect(session.active).to.be.true;
        });
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      const fakeStep = { path: '/bar' };
      const redirect = new class extends EntryPoint {
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
