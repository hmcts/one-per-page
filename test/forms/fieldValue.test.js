const { expect, sinon } = require('../util/chai');
const {
  FieldValue,
  ObjectFieldValue,
  TransformFieldValue
} = require('../../src/forms/fieldValue');
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

  describe('TransformFieldValue', () => {
    {
      const transformation = f => f;
      const field = new FieldValue({ name: 'field', value: 'foo' });
      const t = new TransformFieldValue({ transformation, field });

      it('accepts a field and a transformation function', () => {
        expect(t.field).to.eql(field);
        expect(t.transformation).to.eql(transformation);
      });

      it('takes its name and id from the field', () => {
        expect(t.name).to.eql(field.name);
        expect(t.id).to.eql(field.id);
      });

      it('exposes any child fields the field has', () => {
        const objectField = new ObjectFieldValue({ fields: { foo: field } });
        const nested = new TransformFieldValue({
          transformation,
          field: objectField
        });
        expect(nested).to.have.property('foo');
        expect(nested.foo).to.eql(objectField.foo);
      });
    }

    describe('#serialize', () => {
      it('calls field.serialize', () => {
        const transformation = f => f;
        const field = { serialize: sinon.stub().returns({}) };
        const t = new TransformFieldValue({ transformation, field });
        expect(t.serialize()).to.eql({});
        expect(field.serialize).calledOnce;
      });
    });

    describe('#validate', () => {
      beforeEach(() => {
        sinon.spy(Array, 'isArray');
      });
      afterEach(() => {
        Array.isArray.restore();
      });

      it('executes any validations on the transformed value', () => {
        const toArray = value => value.split(',');
        const field = { name: 'field', value: '1,2,3', validate: () => true };
        const arrayCheck = validator('field', 'An error',
          f => Array.isArray(f.value)
        );

        const t = new TransformFieldValue({
          transformation: toArray,
          field,
          validations: [arrayCheck]
        });

        sinon.spy(arrayCheck, 'predicate');

        expect(t.validate()).to.be.true;
        expect(arrayCheck.predicate).calledWith(t);
        expect(Array.isArray).calledWith(['1', '2', '3']);
      });

      it('executes the fields validations', () => {
        const field = {
          name: 'field', value: '1,2,3',
          validate: sinon.stub().returns(true)
        };
        const t = new TransformFieldValue({ transformation: v => v, field });

        expect(t.validate()).to.eql(true);
        expect(field.validate).calledOnce;
      });

      it("only executes it's validations if the fields passed", () => {
        const field = { name: 'field', validate: () => false };
        const notRun = validator('field', 'pass', sinon.stub().returns(true));

        const t = new TransformFieldValue({
          transformation: v => v,
          field,
          validations: [notRun]
        });

        expect(t.validate()).to.eql(false);
        expect(notRun.predicate).not.called;
      });
    });

    describe('#value', () => {
      it('transforms the fields value', () => {
        const field = { value: 'John Smith' };
        const t = new TransformFieldValue({
          transformation: sinon.stub().returns('foo'),
          field
        });
        expect(t.value).to.not.eql(field.value);
        expect(t.transformation).calledOnce;
        expect(t.value).to.eql('foo');
        expect(t.transformation).calledTwice;
      });
    });

    describe('#errors', () => {
      it('includes errors from itself and the field', () => {
        const field = {
          errors: ['from field'],
          value: 'John Smith',
          validate: sinon.stub().returns(true)
        };
        const willFail = validator('field', 'from transformed', () => false);
        const t = new TransformFieldValue({
          transformation: sinon.stub().returns('foo'),
          field,
          validations: [willFail]
        });
        t.validate();
        expect(t.errors).to.eql(['from field', 'from transformed']);
      });
    });

    describe('#mappedErrors', () => {
      it('includes errors from itself and the field', () => {
        const field = {
          errors: ['from field'],
          value: 'John Smith',
          validate: sinon.stub().returns(true)
        };
        const transformedErr = validator('f', 'from transformed', () => false);
        const t = new TransformFieldValue({
          transformation: sinon.stub().returns('foo'),
          field,
          validations: [transformedErr]
        });
        t.validate();
        expect(t.mappedErrors).to.eql([
          new FieldError(t, 'from field'),
          new FieldError(t, 'from transformed')
        ]);
      });
    });

    describe('#valid', () => {
      const transformation = value => value;
      const invalidField = {
        valid: false,
        validate: sinon.stub().returns(false)
      };
      const validField = {
        valid: true,
        validate: sinon.stub().returns(true)
      };
      const willFail = validator('field', 'an error', () => false);
      const willPass = validator('field', 'no error', () => true);

      it('returns true if it and field are valid', () => {
        const t = new TransformFieldValue({
          transformation,
          field: validField,
          validations: [willPass]
        });
        t.validate();
        expect(t.valid).to.be.true;
      });

      it('returns false if it is not valid', () => {
        const t = new TransformFieldValue({
          transformation,
          field: validField,
          validations: [willFail]
        });
        t.validate();
        expect(t.valid).to.be.false;
      });

      it('returns false if the field is not valid', () => {
        const t = new TransformFieldValue({
          transformation,
          field: invalidField,
          validations: [willPass]
        });
        t.validate();
        expect(t.valid).to.be.false;
      });
    });

    describe('#validated', () => {
      const transformation = value => value;
      const notValidatedField = {
        validated: false,
        validate: sinon.stub().returns(true)
      };
      const validatedField = {
        validated: true,
        validate: sinon.stub().returns(true)
      };
      const willPass = validator('field', 'no error', () => true);

      it('returns true if it and field have been validated', () => {
        const t = new TransformFieldValue({
          transformation,
          field: validatedField,
          validations: [willPass]
        });
        t.validate();
        expect(t.validated).to.be.true;
      });

      it('returns false if it has not been validated', () => {
        const t = new TransformFieldValue({
          transformation,
          field: notValidatedField,
          validations: [willPass]
        });
        expect(t.validated).to.be.false;
      });
    });
  });
});
