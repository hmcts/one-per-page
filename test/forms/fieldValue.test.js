const { expect, sinon } = require('../util/chai');
const { FieldValue } = require('../../src/forms/fieldValue');

describe('forms/fieldValue', () => {
  describe('FieldValue', () => {
    describe('#constructor', () => {
      const f = new FieldValue({ id: 'id', name: 'name', value: 'value' });

      it('stores #name', () => {
        expect(f).to.have.property('name', 'name');
      });
      it('stores #value', () => {
        expect(f).to.have.property('value', 'value');
      });
    });

    describe('#serialize', () => {
      it('returns an object representing the field', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.serialize()).to.eql({ name: 'value' });
      });
    });

    describe('#validate', () => {
      it('executes validations against the field', () => {
        const validation = sinon.stub();
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [validation]
        });
        f.validate();
        expect(validation).calledWith(f);
      });

      it('stops on the first validation to fail', () => {
        const willFail = sinon.stub().returns('An error');
        const willPass = sinon.stub();
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(willFail).calledWith(f);
        expect(willPass).not.called;
      });
    });
  });
});
