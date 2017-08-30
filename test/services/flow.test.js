const { expect, sinon } = require('../util/chai');
const { goTo } = require('../../src/services/flow');

describe('services/flow', () => {
  describe('#goTo', () => {
    it('returns an object with a redirect method', () => {
      const fakeStep = { url: '/foo' };
      expect(goTo(fakeStep)).to.be.an('object');
      expect(goTo(fakeStep).redirect).to.be.a('function');
    });

    describe('#redirect', () => {
      it('redirects to the given step', () => {
        const fakeStep = { url: '/foo' };
        const fakeRes = { redirect: sinon.stub() };
        goTo(fakeStep).redirect({}, fakeRes);
        expect(fakeRes.redirect).calledOnce;
        expect(fakeRes.redirect).calledWith(fakeStep.url);
      });
    });
  });
});
