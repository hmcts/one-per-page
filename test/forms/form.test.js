const { expect, sinon } = require('../util/chai');
const { form, Form } = require('../../src/forms/form');
const { field, FieldDesriptor } = require('../../src/forms/field');
const FieldError = require('../../src/forms/fieldError');

describe('forms/form', () => {
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
        const req = { body: {} };

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
      it('throws if session not setup', () => {
        const f = new Form([]);
        const req = {};
        expect(() => f.retrieve(req)).to.throw('Session not initialized');
      });

      it('throws if not bound to a step', () => {
        const f = new Form([]);
        const req = { session: {} };
        expect(() => f.retrieve(req)).to.throw('Form is not bound to a step');
      });

      it('calls field.deserialize on each field', () => {
        const fields = [field('foo'), field('bar')];
        const f = new Form(fields);
        const step = { name: 'MyStep' };
        f.bind(step);
        const req = { session: {} };

        fields.forEach(_field => sinon.spy(_field, 'deserialize'));
        f.retrieve(req);
        fields.forEach(_field => expect(_field.deserialize).calledOnce);
      });

      it('creates an array of FieldDesriptors', () => {
        const f = new Form([]);
        const req = { session: {} };
        const step = { name: 'MyStep' };
        f.bind(step);
        f.retrieve(req);
        expect(f.fields).to.be.an('array');
        f.fields.forEach(retrievedField => {
          expect(retrievedField).to.be.an.instanceof(FieldDesriptor);
        });
      });

      it('loads values from the session', () => {
        const f = new Form([field('firstName'), field('lastName')]);
        const step = { name: 'MyStep' };
        const req = {
          session: {
            MyStep: {
              firstName: 'Michael',
              lastName: 'Allen'
            }
          }
        };
        f.bind(step);
        f.retrieve(req);
        const values = f.fields.map(_field => _field.serialize());
        expect(values).to.eql([
          { firstName: 'Michael' },
          { lastName: 'Allen' }
        ]);
      });
    });

    describe('#store', () => {
      const name = new FieldDesriptor('name', 'Details_name', 'Michael Allen');
      const colour = new FieldDesriptor('colour', 'Prefs_colour', 'Green');

      it('throws an error if not bound to a step', () => {
        const f = new Form();
        const req = { session: {} };

        expect(() => f.store(req)).to.throw('Form is not bound to a step');
      });

      it('throws an error if session is not initialized', () => {
        const f = new Form();
        const req = {};

        expect(() => f.store(req)).to.throw('Session not initialized');
      });

      it('calls req.field.serialize on each field', () => {
        const f = new Form([name, colour]);
        const step = { name: 'MyStep' };
        const req = {
          body: { MyStep: { name, colour } },
          session: {}
        };

        sinon.spy(name, 'serialize');
        sinon.spy(colour, 'serialize');

        f.bind(step);
        f.store(req);

        expect(name.serialize).calledOnce;
        expect(colour.serialize).calledOnce;
        name.serialize.restore();
        colour.serialize.restore();
      });

      it('stores the serialized fields in the session', () => {
        const f = new Form([field('name'), field('colour')]);
        const req = {
          body: { name: 'Michael Allen', colour: 'Green' },
          session: {}
        };
        const step = { name: 'MyStep' };

        f.bind(step);
        f.parse(req);
        f.store(req);
        expect(req.session).to.have.property(step.name);
        expect(req.session[step.name]).has.property('name', 'Michael Allen');
        expect(req.session[step.name]).to.have.property('colour', 'Green');
      });

      it('only calls serialize on fields declared in the form', () => {
        const f = new Form([field('colour')]);
        const step = { name: 'MyStep' };
        const req = {
          body: { name: 'Michael Allen', colour: 'Green' },
          session: {}
        };
        f.bind(step);
        f.parse(req);
        f.store(req);
        expect(req.session).to.eql({ [step.name]: { colour: 'Green' } });
      });
    });

    describe('#errors', () => {
      const errorMessage = 'Error message';
      const returnIsValid = () => null;
      const returnIsInvalid = () => errorMessage;
      const error = f => new FieldError(f, errorMessage);

      it('returns invalid fields', () => {
        const invalidField = new FieldDesriptor('name')
          .validate(returnIsInvalid);
        const f = new Form([invalidField]);
        f.validate();
        expect(f.errors).to.eql([error(invalidField)]);
      });

      it('only returns invalid fields', () => {
        const validField1 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField2 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const invalidField = new FieldDesriptor('name')
          .validate(returnIsInvalid);

        const f = new Form([validField1, validField2, invalidField]);
        f.validate();
        expect(f.errors).to.eql([error(invalidField)]);
      });

      it('returns [] if all fields are valid', () => {
        const validField = new FieldDesriptor('name')
          .validate(returnIsValid);

        const f = new Form([validField]);
        f.validate();
        expect(f.errors).to.eql([]);
      });
    });

    describe('#validate', () => {
      {
        const returnIsValid = sinon.stub().returns();

        const validField1 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField2 = new FieldDesriptor('name')
          .validate(returnIsValid);
        const validField3 = new FieldDesriptor('name')
          .validate(returnIsValid);

        const f = new Form([validField1, validField2, validField3]);
        const result = f.validate();

        it('executes field validations', () => {
          expect(returnIsValid).to.have.callCount(3);
        });
        it('returns true if validations pass', () => {
          expect(result).to.be.true;
        });
      }

      it('returns false if a validation fails', () => {
        const errorMessage = 'Error message';
        const returnIsInvalid = sinon.stub().returns(errorMessage);
        const invalidField = new FieldDesriptor('name')
          .validate(returnIsInvalid);
        const f = new Form([invalidField]);

        expect(f.validate()).to.be.false;
      });
    });

    describe('#validated', () => {
      it('returns false when a form hasn\'t been validated yet', () => {
        const nameField = new FieldDesriptor('name');
        const f = new Form([nameField]);
        expect(f.validated).to.be.false;
      });
      it('returns true if the any validation has been run', () => {
        const nameField = new FieldDesriptor('name');
        const f = new Form([nameField, new FieldDesriptor('other')]);
        nameField.validate();
        expect(f.validated).to.be.true;
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
        f.validate();
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
        f.validate();
        expect(f.valid).to.eql(false);
      });
    });
  });
});
