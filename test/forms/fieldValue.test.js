const { expect, sinon } = require('../util/chai');
const { FieldValue } = require('../../src/forms/fieldValue');
const FieldError = require('../../src/forms/fieldError');

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

    describe('#errors', () => {
      it('returns [] if the field has not been validated', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.errors).to.eql([]);
      });

      it('returns any errors returned by validations', () => {
        const willFail = sinon.stub().returns('An error');
        const willPass = sinon.stub();
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(f.errors).to.eql(['An error']);
      });
    });

    describe('#mappedErrors', () => {
      it('returns [] if the field has not been validated', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.mappedErrors).to.eql([]);
      });

      it('returns a FieldError for each error returned by validations', () => {
        const willFail = sinon.stub().returns('An error');
        const willPass = sinon.stub();
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(f.mappedErrors).to.eql([new FieldError(f, 'An error')]);
      });
    });
  });
});
