const { expect, sinon } = require('../util/chai');
const Redirector = require('../../src/flow/redirector');

describe('flow/Redirector', () => {
  describe('#if', () => {
    it('controls whether you redirect to this goTo', () => {
      const fakeStep = { path: '/foo' };
      const fakeRes = { redirect: sinon.stub() };
      new Redirector(fakeStep).if(() => false).redirect({}, fakeRes);
      expect(fakeRes.redirect).to.not.be.called;
    });
  });

  describe('#redirect', () => {
    it('redirects to the given step', () => {
      const fakeStep = { path: '/foo' };
      const fakeRes = { redirect: sinon.stub() };
      new Redirector(fakeStep).redirect({}, fakeRes);
      expect(fakeRes.redirect).calledOnce;
      expect(fakeRes.redirect).calledWith(fakeStep.path);
    });
  });
});
