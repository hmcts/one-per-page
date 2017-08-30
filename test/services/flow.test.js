const { expect, sinon } = require('../util/chai');
const {
  goTo,
  branch,
  Redirector,
  Conditional,
  Branch
} = require('../../src/services/flow');

describe('services/flow', () => {
  describe('#goTo', () => {
    it('returns a Redirector with a redirect method', () => {
      const fakeStep = { url: '/foo' };
      expect(goTo(fakeStep)).to.be.an.instanceof(Redirector);
      expect(goTo(fakeStep).redirect).to.be.a('function');
    });
  });

  describe('#branch', () => {
    it('returns a Branch with a redirect method', () => {
      const fakeRedirector = { redirect: sinon.stub() };
      const conditional = new Conditional(fakeRedirector, () => true);
      const b = branch(conditional, fakeRedirector);

      expect(b).to.be.an.instanceof(Branch);
      expect(b.redirect).to.be.a('function');
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

  describe('Branch', () => {
    describe('#constructor', () => {
      it('throws if only one branch given', () => {
        const fakeRedirector = { redirect: sinon.stub() };
        const onlyOneBranch = () => new Branch(fakeRedirector);
        expect(onlyOneBranch).to.throw('Branch needs atleast two paths');
      });

      it('throws if no branches given', () => {
        const noBranches = () => new Branch();
        expect(noBranches).to.throw('Branch needs atleast two paths');
      });

      it('throws if the last branch is a Conditional', () => {
        const fakeRedirector = { redirect: sinon.stub() };
        const conditional = new Conditional(fakeRedirector, () => true);
        const noFallback = () => new Branch(conditional, conditional);

        expect(noFallback).to.throw('The last path must not be conditional');
      });

      it('throws if the first n-1 branches are not Conditional', () => {
        const fakeRedirector = { redirect: sinon.stub() };
        const noConditionals = () => new Branch(fakeRedirector, fakeRedirector);

        expect(noConditionals)
          .to.throw('All but the last path must be conditional');
      });
    });

    describe('#redirect', () => {
      const willFail = new Conditional({ redirect: sinon.stub() }, () => false);
      const willPass = new Conditional({ redirect: sinon.stub() }, () => true);
      const fallback = new Redirector({ url: '/foo' });
      sinon.stub(fallback, 'redirect');

      beforeEach(() => {
        willFail.redirector.redirect.reset();
        willPass.redirector.redirect.reset();
        fallback.redirect.reset();
      });

      it('redirects to the first branch whose check passes', () => {
        branch(willPass, fallback).redirect({}, {});
        expect(willPass.redirector.redirect).calledOnce;
        expect(willFail.redirector.redirect).not.called;
        expect(fallback.redirect).not.called;
      });

      it('does not call redirect of conditionals whose checks fail', () => {
        branch(willFail, willPass, fallback).redirect({}, {});
        expect(willPass.redirector.redirect).calledOnce;
        expect(willFail.redirector.redirect).not.called;
        expect(fallback.redirect).not.called;
      });

      it('calls the fallback if all branches fail', () => {
        branch(willFail, fallback).redirect({}, {});
        expect(willFail.redirector.redirect).not.called;
        expect(fallback.redirect).calledOnce;
      });
    });
  });
});
