const util = require('util');
const { expect, sinon } = require('../util/chai');
const { contentProxy } = require('../../src/i18n/contentProxy');

describe('i18n/contentProxy', () => {
  describe('contentProxy', () => {
    it('exposes an es6 proxy handler', () => {
      expect(contentProxy).to.be.an('object');
      expect(contentProxy).to.have.property('get').that.is.a('function');
    });

    const t = sinon.stub();
    const exists = sinon.stub();
    const proxy = new Proxy({ t, exists }, contentProxy);

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
  });
});
