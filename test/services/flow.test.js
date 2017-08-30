const { expect, sinon } = require('../util/chai');
const { goTo, Redirector } = require('../../src/services/flow');

describe('services/flow', () => {
  describe('#goTo', () => {
    it('returns a Redirector with a redirect method', () => {
      const fakeStep = { url: '/foo' };
      expect(goTo(fakeStep)).to.be.an.instanceof(Redirector);
      expect(goTo(fakeStep).redirect).to.be.a('function');
    });
  });

  describe('Redirector', () => {

    describe('#redirect', () => {
      it('redirects to the given step', () => {
        const fakeStep = { url: '/foo' };
        const fakeRes = { redirect: sinon.stub() };
        new Redirector(fakeStep).redirect({}, fakeRes);
        expect(fakeRes.redirect).calledOnce;
        expect(fakeRes.redirect).calledWith(fakeStep.url);
      });
    });
  });
});
