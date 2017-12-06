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

  describe('#ownKeys', () => {
    it('returns all field names (Reflect.ownKeys)', () => {
      const _form = form(field('name'), field('dob'));
      const proxy = new Proxy(_form, formProxyHandler);
      expect(Reflect.ownKeys(proxy)).to.eql(['name', 'dob']);
    });

    it('returns all field names (Object.keys)', () => {
      const _form = form(field('name'), field('dob'));
      const proxy = new Proxy(_form, formProxyHandler);
      expect(Object.keys(proxy)).to.eql(['name', 'dob']);
    });

    it('respects ordering of fields', () => {
      const form1 = form(field('dob'), field('name'));
      const keys1 = Object.keys(new Proxy(form1, formProxyHandler));

      const form2 = form(field('name'), field('dob'));
      const keys2 = Object.keys(new Proxy(form2, formProxyHandler));

      expect(keys1).to.eql(['dob', 'name']);
      expect(keys2).to.eql(['name', 'dob']);
    });
  });

  describe('#getOwnPropertyDescriptor', () => {
    const _form = form(field('name'));
    const proxy = new Proxy(_form, formProxyHandler);

    const descriptor = Object.getOwnPropertyDescriptor(proxy, 'name');

    it('is enumerable', () => {
      expect(descriptor.enumerable).to.be.true;
    });
    it("has the field as it's value", () => {
      expect(descriptor.value).to.eql(_form.fields[0]);
    });
  });

  it('responds to Object.values', () => {
    const _form = form(field('name'));
    const proxy = new Proxy(_form, formProxyHandler);

    expect(Object.values(proxy)).to.eql(_form.fields);
  });
});
