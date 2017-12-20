const { expect, sinon } = require('../util/chai');
const { FieldValue, ObjectFieldValue } = require('../../src/forms/fieldValue');
const FieldError = require('../../src/forms/fieldError');
const { validator } = require('../../src/forms/validator');

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
        const validation = sinon.stub().returns(true);
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [validator('name', 'No error', validation)]
        });
        f.validate();
        expect(validation).calledWith(f);
      });

      it('stops on the first validation to fail', () => {
        const willFail = validator(
          'name', 'An error',
          sinon.stub().returns(false)
        );
        const willPass = validator(
          'name', 'No error',
          sinon.stub().returns(true)
        );
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(willFail.predicate).calledWith(f);
        expect(willPass.predicate).not.called;
      });
    });

    describe('#errors', () => {
      it('returns [] if the field has not been validated', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.errors).to.eql([]);
      });

      it('returns any errors returned by validations', () => {
        const willFail = validator('name', 'An error', () => false);
        const willPass = validator('name', 'No error', () => true);
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
        const willFail = validator('name', 'An error', () => false);
        const willPass = validator('name', 'No error', () => true);
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

  describe('ObjectFieldValue', () => {
    it('maps validators to its child fields', () => {
      const day = new FieldValue({ name: 'day', value: '1' });
      const month = new FieldValue({ name: 'month', value: '12' });
      const year = new FieldValue({ name: 'year', value: '2017' });

      const dayValidator = validator('day', 'A day error', () => true);
      const monthValidator = validator('month', 'A month error', () => true);
      const yearValidator = validator('year', 'A year error', () => true);

      const f = new ObjectFieldValue({
        fields: { day, month, year },
        validations: [dayValidator, monthValidator, yearValidator]
      });

      expect(f.validations).to.eql([]);
      expect(day.validations).has.length(1);
      expect(month.validations).has.length(1);
      expect(year.validations).has.length(1);
    });

    describe('#validate', () => {
      it('passes the parent to any mapped validations', () => {
        const notMapped = validator('child', '', sinon.stub().returns(true));
        const child = new FieldValue({
          name: 'child',
          value: '1',
          validations: [notMapped]
        });

        const mapped = validator('child', '', sinon.stub().returns(true));

        const f = new ObjectFieldValue({
          fields: { child },
          validations: [mapped]
        });
        f.validate();
        expect(mapped.predicate).calledWith(f);
        expect(notMapped.predicate).calledWith(child);
      });

      it("won't execute the parents validators if child.validate fails", () => {
        const willFail = validator('child', '', sinon.stub().returns(false));
        const wontRun = validator('f', '', sinon.stub().returns(true));

        const child = new FieldValue({ name: 'child', value: '1' });
        const f = new ObjectFieldValue({
          name: 'f',
          fields: { child },
          validations: [wontRun, willFail]
        });
        f.validate();
        expect(f.validate()).to.be.false;
        expect(wontRun.predicate).not.called;
      });
    });

    describe('#mappedErrors', () => {
      it('includes errors from any child fields', () => {
        const willFailNotMapped = validator('child1', 'notMapped', () => false);
        const willFailMapped = validator('child2', 'mapped', () => false);


        const child1 = new FieldValue({
          name: 'child1',
          validations: [willFailNotMapped]
        });
        const child2 = new FieldValue({ name: 'child2' });

        const f = new ObjectFieldValue({
          fields: { child1, child2 },
          validations: [willFailMapped]
        });
        f.validate();
        expect(f.mappedErrors).to.eql([
          new FieldError(child1, 'notMapped'),
          new FieldError(child2, 'mapped')
        ]);
      });
    });
  });
});
