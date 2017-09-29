const { expect, sinon } = require('../util/chai');
const { form, field } = require('../../src/forms');
const formProxyHandler = require('../../src/forms/formProxyHandler');

describe('forms/formProxyHandler', () => {
  describe('#get', () => {
    it('proxy.[field] -> form.fields[field]', () => {
      const nameField = field('name');
      const _form = form(nameField);
      const proxy = new Proxy(_form, formProxyHandler);
      expect(proxy.name.name).to.eql(nameField.name);
    });

    it('proxy.[undefined field] -> undefined', () => {
      const _form = form();
      const proxy = new Proxy(_form, formProxyHandler);
      expect(proxy.name).to.be.undefined;
    });

    {
      const notProxied = ['validate', 'store'];

      notProxied.forEach(property => {
        it(`proxy.${property} -> form.${property}`, () => {
          const _form = form();
          const proxy = new Proxy(_form, formProxyHandler);
          const stub = sinon.stub(_form, property);

          proxy[property]();
          expect(stub).calledOnce;
        });
      });
    }

    {
      const _form = form();
      const proxy = new Proxy(_form, formProxyHandler);

      it('proxy.errors -> form.errors', () => {
        expect(proxy.errors).to.eql(_form.errors);
      });
      it('proxy.valid -> form.valid', () => {
        expect(proxy.valid).to.eql(_form.valid);
      });
      it('proxy.validated -> form.validated', () => {
        expect(proxy.validated).to.eql(_form.validated);
      });
    }
  });
});
