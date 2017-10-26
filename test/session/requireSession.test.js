const { expect } = require('../util/chai');
const { testStep } = require('../util/supertest');
const Page = require('../../src/steps/Page');
const requireSession = require('../../src/session/requireSession');

describe('session/requireSession', () => {
  const page = new class extends Page {
    get middleware() {
      return [requireSession, ...super.middleware];
    }
    get template() {
      return 'page_views/simplePage';
    }
  }();

  describe('no session', () => {
    it('redirects to /', () => {
      return testStep(page).get().expect(302).expect('Location', '/');
    });

    it('req.journey.noSessionHandler can override behaviour', () => {
      const noSessionHandler = (req, res) => res.end('No Session');
      return testStep(page)
        .withSetup(req => {
          req.journey.noSessionHandler = noSessionHandler;
        })
        .get()
        .expect(200, 'No Session');
    });
  });

  describe('with session', () => {
    it('passes through to the steps handler', () => {
      return testStep(page)
        .withSetup(req => req.session.generate())
        .get()
        .html($ => expect($('h1')).to.have.$text('Hello, World!'));
    });
  });
});
