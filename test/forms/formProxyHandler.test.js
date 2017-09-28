const { expect } = require('../util/chai');
const { form, field } = require('../../src/forms');
const formProxyHandler = require('../../src/forms/formProxyHandler');

describe('forms/formProxyHandler', () => {
  describe('#get', () => {
    it('proxies the name of a field to that field in the form', () => {
      const nameField = field('name');
      const _form = form(nameField);
      const proxy = new Proxy(_form, formProxyHandler);
      expect(proxy.name.name).to.eql(nameField.name);
    });

    it('returns undefined when accessing an undefined field', () => {
      const _form = form();
      const proxy = new Proxy(_form, formProxyHandler);
      expect(proxy.name).to.be.undefined;
    });
  });
});
