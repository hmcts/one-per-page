const util = require('util');
const { expect, sinon } = require('../util/chai');
const { contentProxy } = require('../../src/i18n/contentProxy');

describe('i18n/contentProxy', () => {
  describe('contentProxy', () => {
    it('exposes an es6 proxy handler', () => {
      const fakeStep = {};
      const handler = contentProxy(fakeStep);
      expect(handler).to.be.an('object');
      expect(handler).to.have.property('get').that.is.a('function');
    });

    const t = sinon.stub();
    const exists = sinon.stub();
    const fakeStep = {};
    const proxy = new Proxy({ t, exists }, contentProxy(fakeStep));

    beforeEach(() => {
      t.reset();
      exists.reset();
    });

    it('proxies proxy.[key] to a new proxy', () => {
      exists.withArgs('key').returns(true);
      t.withArgs('key').returns('Content');
      const key = proxy.key;
      expect(key.inspect()).to.match(/Proxy/);
    });

    describe('#toString', () => {
      it('returns i18n.t("[key]") if key exists', () => {
        exists.withArgs('key').returns(true);
        t.withArgs('key').returns('Content');
        const key = proxy.key;
        expect(key.toString()).to.eql('Content');
      });

      it('returns i18n.t("[key]") if key exists (Symbol)', () => {
        exists.withArgs('key').returns(true);
        t.withArgs('key').returns('Content');
        const key = proxy.key;
        expect(key[Symbol.toStringTag]()).to.eql('Content');
      });

      it('throws if key doesn\'t exist', () => {
        exists.withArgs('key').returns(false);
        const key = proxy.key;
        expect(() => key.toString()).to.throw(/No translation for key/);
      });

      it('proxies nested keys i18n.t("key.key")', () => {
        exists.withArgs('foo.bar').returns(true);
        t.withArgs('foo.bar').returns('Content');

        expect(proxy.foo.bar.toString()).to.eql('Content');
      });
    });

    describe('#inspect', () => {
      const key = 'foo';
      const msg = 'Foo is fine';
      const description = `Proxy { key: ${key}, value: ${msg} }`;

      beforeEach(() => {
        t.withArgs(key).returns(msg);
      });

      it('returns a description of the proxy', () => {
        expect(proxy.foo.inspect()).to.eql(description);
      });
      it('returns a description of the proxy (Symbol)', () => {
        expect(proxy.foo[util.inspect.custom]()).to.eql(description);
      });
    });

    describe('#hasOwnProperty (used by nunjucks)', () => {
      it('returns true for #toString (string)', () => {
        expect(proxy.foo.hasOwnProperty('toString')).to.be.true;
      });
      it('returns true for #toString (symbol)', () => {
        expect(proxy.foo.hasOwnProperty(Symbol.toStringTag)).to.be.true;
      });
      it('returns true for #inspect (string)', () => {
        expect(proxy.foo.hasOwnProperty('inspect')).to.be.true;
      });
      it('returns true for #inspect (symbol)', () => {
        expect(proxy.foo.hasOwnProperty(util.inspect.custom)).to.be.true;
      });

      it('returns false for #__keywords', () => {
        // used by nunjucks to determine if the last argument in a macro
        // is a dict of keyword args
        expect(proxy.foo.hasOwnProperty('__keywords')).to.be.false;
      });
    });
  });
});
