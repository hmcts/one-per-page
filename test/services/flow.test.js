const { expect, sinon } = require('../util/chai');
const { goTo, Redirector, Conditional } = require('../../src/services/flow');

describe('services/flow', () => {
  describe('#goTo', () => {
    it('returns a Redirector with a redirect method', () => {
      const fakeStep = { url: '/foo' };
      expect(goTo(fakeStep)).to.be.an.instanceof(Redirector);
      expect(goTo(fakeStep).redirect).to.be.a('function');
    });
  });

  describe('Redirector', () => {
    describe('#if', () => {
      it('controls whether you redirect to this goTo', () => {
        const fakeStep = { url: '/foo' };
        const fakeRes = { redirect: sinon.stub() };
        new Redirector(fakeStep).if(() => false).redirect({}, fakeRes);
        expect(fakeRes.redirect).to.not.be.called;
      });
    });

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

  describe('Conditional', () => {
    describe('#redirect', () => {
      it('calls the redirector if the condition passes', () => {
        const redirector = { redirect: sinon.stub() };
        new Conditional(redirector, () => true).redirect({}, {});
        expect(redirector.redirect).to.be.called;
      });

      it('does not call the redirector if the condition fails', () => {
        const redirector = { redirect: sinon.stub() };
        new Conditional(redirector, () => false).redirect({}, {});
        expect(redirector.redirect).to.not.be.called;
      });
    });
  });
});
