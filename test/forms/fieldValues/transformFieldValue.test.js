const { expect, sinon } = require('../../util/chai');
const {
  FieldValue,
  ObjectFieldValue,
  TransformFieldValue
} = require('../../../src/forms/fieldValue');
const FieldError = require('../../../src/forms/fieldError');
const { validator } = require('../../../src/forms/validator');

describe('forms/fieldValue', () => {
  describe('TransformFieldValue', () => {
    {
      const transformation = f => f;
      const field = new FieldValue({ name: 'field', value: 'foo' });
      const t = new TransformFieldValue({ transformation, field });

      it('accepts a field and a transformation function', () => {
        expect(t.wrapped).to.eql(field);
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
