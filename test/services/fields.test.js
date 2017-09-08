const { expect, sinon } = require('../util/chai');
const {
  field,
  FieldDesriptor,
  form,
  Form
} = require('../../src/services/fields');

describe('services/fields', () => {
  describe('#field', () => {
    it('returns a FieldDesriptor', () => {
      const foo = field('foo');
      expect(foo).to.be.an.instanceof(FieldDesriptor);
    });
  });

  describe('#form', () => {
    it('returns a Form', () => {
      const f = form(field('foo'));
      expect(f).to.be.an.instanceof(Form);
      expect(f.fields).to.eql([field('foo')]);
    });

    it('is happy with no fields', () => {
      const f = form();
      expect(f).to.be.an.instanceof(Form);
      expect(f.fields).to.eql([]);
    });
  });

  describe('Form', () => {
    it('accepts an array of fields', () => {
      const fields = [field('foo'), field('bar')];
      const f = new Form(fields);
      expect(f).to.have.property('fields').that.eql(fields);
    });

    describe('#parse', () => {
      it('calls field.parse on each field', () => {
        const fields = [field('foo'), field('bar')];
        const f = new Form(fields);
        const req = { currentStep: {} };

        fields.forEach(_field => sinon.spy(_field, 'parse'));
        f.parse(req);
        fields.forEach(_field => expect(_field.parse).calledOnce);
      });

      it('creates an array of FieldDesriptor', () => {
        const f = new Form([]);
        const req = { currentStep: {} };
        f.parse(req);
        expect(f.fields).to.be.an('array');
        f.fields.forEach(parsedField => {
          expect(parsedField).to.be.an.instanceof(FieldDesriptor);
        });
      });
    });

    describe('#retrieve', () => {
      it('calls field.deserialize on each field', () => {
        const fields = [field('foo'), field('bar')];
        const f = new Form(fields);
        const req = { currentStep: {} };

        fields.forEach(_field => sinon.spy(_field, 'deserialize'));
        f.retrieve(req);
        fields.forEach(_field => expect(_field.deserialize).calledOnce);
      });

      it('creates an array of FieldDesriptors', () => {
        const f = new Form([]);
        const req = { currentStep: {} };
        f.retrieve(req);
        expect(f.fields).to.be.an('array');
        f.fields.forEach(retrievedField => {
          expect(retrievedField).to.be.an.instanceof(FieldDesriptor);
        });
      });
    });

    describe('#store', () => {
      const name = new FieldDesriptor('name', 'Details_name', 'Michael Allen');
      const colour = new FieldDesriptor('colour', 'Prefs_colour', 'Green');

      it('throws an error if session is not initialized', () => {
        const f = new Form();
        const req = {};

        expect(() => f.store(req)).to.throw('Session not initialized');
      });

      it('calls req.field.serialize on each field', () => {
        const f = new Form([name, colour]);
        const req = { fields: { name, colour }, session: {} };

        sinon.spy(name, 'serialize');
        sinon.spy(colour, 'serialize');
        f.store(req);
        expect(name.serialize).calledOnce;
        expect(colour.serialize).calledOnce;
        name.serialize.restore();
        colour.serialize.restore();
      });

      it('stores the serialized fields in the session', () => {
        const f = new Form([field('name'), field('colour')]);
        const req = {
          body: {
            name: 'Michael Allen',
            colour: 'Green'
          },
          session: {}
        };
        f.parse(req);
        f.store(req);
        expect(req.session).to.have.property('name', 'Michael Allen');
        expect(req.session).to.have.property('colour', 'Green');
      });

      it('only calls serialize on fields declared in the form', () => {
        const f = new Form([field('colour')]);
        const req = {
          body: {
            name: 'Michael Allen',
            colour: 'Green'
          },
          session: {}
        };
        f.parse(req);
        f.store(req);
        expect(req.session).to.eql({ colour: 'Green' });
      });
    });

    describe('#invalidFields', () => {
      const errorMessage = 'Error message';
      const returnIsValid = sinon.stub().returns();
      const returnIsInvalid = sinon.stub().returns(errorMessage);

      it('returns invalid fields', () => {
        const invalidField = new FieldDesriptor('name')
          .validate(returnIsInvalid);
        const f = new Form([invalidField]);
        expect(f.invalidFields).to.eql([invalidField]);
        expect(f.invalidFields[0]).to.be.an.instanceof(FieldDesriptor);
      });

      it('only returns invalid fields', () => {
        const validField1 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField2 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const invalidField = new FieldDesriptor('name')
          .validate(returnIsInvalid);

        const f = new Form([validField1, validField2, invalidField]);
        expect(f.invalidFields).to.eql([invalidField]);
        expect(f.invalidFields[0]).to.be.an.instanceof(FieldDesriptor);
      });
    });

    describe('#valid', () => {
      const errorMessage = 'Error message';
      const returnIsValid = sinon.stub().returns();
      const returnIsInvalid = sinon.stub().returns(errorMessage);

      it('returns valid if all fields pass validation', () => {

        const validField1 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField2 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField3 = new FieldDesriptor('name')
          .validate(returnIsValid);

        const f = new Form([validField1, validField2, validField3]);
        expect(f.valid).to.eql(true);
      });

      it('returns invalid if one of the fields fails validation', () => {
        const validField1 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField2 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const invalidField1 = new FieldDesriptor('name')
          .validate(returnIsInvalid);

        const f = new Form([validField1, validField2, invalidField1]);
        expect(f.valid).to.eql(false);
      });
    });
  });

  describe('FieldDesriptor', () => {
    it('stores its name', () => {
      const f = new FieldDesriptor('my name');
      expect(f).to.have.property('name', 'my name');
    });

    describe('#serialize', () => {
      it('returns an object representing the field', () => {
        const f = new FieldDesriptor('name', 'Prefs_colour', 'Green');
        expect(f.serialize()).to.eql({ [f.id]: f.value });
      });

      it('returns an empty object if no ID', () => {
        const f = new FieldDesriptor('name', undefined, 'Green');
        expect(f.serialize()).to.eql({});
      });

      it('returns an empty object if no value', () => {
        const f = new FieldDesriptor('name', 'Prefs_colour');
        expect(f.serialize()).to.eql({});
      });
    });

    describe('#deserialize', () => {
      it('returns a FieldDesriptor', () => {
        const foo = new FieldDesriptor('first_name');
        expect(foo.deserialize({})).to.be.an.instanceof(FieldDesriptor);
      });

      it('fills FieldDesriptor.value with answer from the session', () => {
        const req = {
          body: {},
          session: { NameStep_firstName: 'Michael' },
          currentStep: { name: 'NameStep' }
        };
        const firstName = new FieldDesriptor('firstName');
        expect(firstName.deserialize(req)).to.have.property('value', 'Michael');
      });
    });

    describe('#parse', () => {
      it('returns a FieldDesriptor', () => {
        const foo = new FieldDesriptor('first_name');
        expect(foo.parse({})).to.be.an.instanceof(FieldDesriptor);
      });

      it('fills FieldDesriptor.value with answer from request body', () => {
        const req = {
          body: { NameStep_firstName: 'Michael' },
          session: {},
          currentStep: { name: 'NameStep' }
        };
        const firstName = new FieldDesriptor('firstName');
        expect(firstName.parse(req)).to.have.property('value', 'Michael');
      });
    });

    describe('#makeId', () => {
      it('returns the FieldDesriptors name if step is undefined', () => {
        const foo = new FieldDesriptor('first_name', 'Michael');
        expect(foo.makeId()).to.eql(foo.name);
      });

      it('returns an id based on the fields name and step', () => {
        const foo = new FieldDesriptor('first_name', 'Michael');
        const fakeStep = { name: 'NameStep' };
        expect(foo.makeId(fakeStep)).to.eql(`${fakeStep.name}_${foo.name}`);
      });
    });

    describe('#validate', () => {
      const errorMessage = 'Error message';

      it('sets a validator function', () => {
        const validValidator = sinon.stub().returns();
        const foo = new FieldDesriptor('foo');
        // set validator functon
        foo.validate(validValidator);
        foo.validate();
        expect(validValidator).to.have.been.calledOnce;
      });

      it('uses a default validator function if not set', () => {
        const defaultValidator = sinon.stub().returns();

        const foo = new class extends FieldDesriptor {
          constructor(name, id, value) {
            super(name, id, value);
            this.validator = defaultValidator;
          }
        }('foo');

        foo.validate();
        expect(defaultValidator).to.have.been.calledOnce;
      });

      it('returns true if field is valid and validator returns undefined',
        () => {
          const validValidator = sinon.stub().returns();
          const foo = new FieldDesriptor('foo')
            .validate(validValidator);

          const isValid = foo.validate();

          expect(validValidator).to.have.been.calledOnce;
          expect(isValid).to.eql(true);
        });

      it('returns true if field is validator returns null', () => {
        const validValidator = sinon.stub().returns(null);
        const foo = new FieldDesriptor('foo')
          .validate(validValidator);

        const isValid = foo.validate();

        expect(validValidator).to.have.been.calledOnce;
        expect(isValid).to.eql(true);
      });

      it('returns false if field is valid', () => {
        const invalidValidator = sinon.stub().returns(errorMessage);
        const foo = new FieldDesriptor('foo')
          .validate(invalidValidator);

        const isValid = foo.validate();

        expect(isValid).to.eql(false);
        expect(invalidValidator).to.have.been.calledOnce;
      });

      it('sets error to context if field is invalid', () => {
        const invalidValidator = sinon.stub().returns(errorMessage);
        const foo = new FieldDesriptor('foo')
          .validate(invalidValidator);

        const isValid = foo.validate();

        expect(isValid).to.eql(false);
        expect(foo.error).to.eql(errorMessage);
        expect(invalidValidator).to.have.been.calledOnce;
      });
    });
  });
});
