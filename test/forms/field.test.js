const { expect, sinon } = require('../util/chai');
const Joi = require('joi');
const { field, FieldDesriptor } = require('../../src/forms/field');

describe('forms/field', () => {
  describe('#field', () => {
    it('returns a FieldDesriptor', () => {
      const foo = field('foo');
      expect(foo).to.be.an.instanceof(FieldDesriptor);
    });
  });

  describe('FieldDesriptor', () => {
    it('stores its name', () => {
      const f = new FieldDesriptor('my name');
      expect(f).to.have.property('name', 'my name');
    });

    describe('#serialize', () => {
      it('returns an object representing the field', () => {
        const f = new FieldDesriptor('name');
        f.id = 'Prefs_colour';
        f.value = 'Green';
        expect(f.serialize()).to.eql({ [f.id]: f.value });
      });

      it('returns an empty object if no ID', () => {
        const f = new FieldDesriptor('name');
        f.value = 'Green';
        expect(f.serialize()).to.eql({});
      });

      it('returns an empty object if no value', () => {
        const f = new FieldDesriptor('name');
        f.id = 'Prefs_colour';
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

    describe('#validations', () => {
      it('is an empty array on init', () => {
        const _field = new FieldDesriptor('name');
        expect(_field.validations).to.eql([]);
      });
    });

    describe('#validate', () => {
      const errorMessage = 'Error message';

      describe('if given a validator', () => {
        it('adds it to the validations array', () => {
          const validValidator = sinon.stub();
          const foo = new FieldDesriptor('foo');
          foo.validate(validValidator);
          expect(foo.validations).to.contain(validValidator);
        });
      });

      describe('if not given a validator', () => {
        it('returns true if no validator set', () => {
          const foo = new FieldDesriptor('foo');
          const isValid = foo.validate();
          expect(isValid).to.be.true;
        });

        it('returns true if the validator returns undefined', () => {
          const validValidator = sinon.stub().returns();
          const foo = new FieldDesriptor('foo').validate(validValidator);

          const isValid = foo.validate();

          expect(validValidator).to.have.been.calledOnce;
          expect(isValid).to.eql(true);
        });

        it('returns true if the validator returns null', () => {
          const validValidator = sinon.stub().returns(null);
          const foo = new FieldDesriptor('foo').validate(validValidator);

          const isValid = foo.validate();

          expect(validValidator).to.have.been.calledOnce;
          expect(isValid).to.eql(true);
        });

        it('returns false if field is valid', () => {
          const invalidValidator = sinon.stub().returns(errorMessage);
          const foo = new FieldDesriptor('foo').validate(invalidValidator);

          const isValid = foo.validate();

          expect(isValid).to.eql(false);
          expect(invalidValidator).to.have.been.calledOnce;
        });

        it('overrides #errors to if a validator fails', () => {
          const invalidValidator = sinon.stub().returns(errorMessage);
          const foo = new FieldDesriptor('foo').validate(invalidValidator);

          const isValid = foo.validate();

          expect(isValid).to.eql(false);
          expect(foo.errors).to.contain(errorMessage);
          expect(invalidValidator).to.have.been.calledOnce;
        });
      });
    });

    describe('#validated', () => {
      it('returns false when a field hasn\'t been validated yet', () => {
        const nameField = new FieldDesriptor('name');
        expect(nameField.validated).to.be.false;
      });
      it('returns true if the validations have been run', () => {
        const nameField = new FieldDesriptor('name');
        nameField.validate();
        expect(nameField.validated).to.be.true;
      });
    });

    describe('#errors', () => {
      it('returns [] if validations passed', () => {
        const nameField = new FieldDesriptor('name')
          .joi('Will Pass', Joi.any());
        nameField.validate();
        expect(nameField.errors).to.eql([]);
      });

      it('returns errors of failed validations', () => {
        const nameField = new FieldDesriptor('name')
          .joi('Will Fail', Joi.string().required());
        nameField.validate();
        expect(nameField.errors).to.eql(['Will Fail']);
      });
    });

    describe('#valid', () => {
      it('returns true if validations passed', () => {
        const nameField = new FieldDesriptor('name')
          .joi('Will Pass', Joi.any());
        nameField.validate();
        expect(nameField.valid).to.be.true;
      });

      it('returns false if validations failed', () => {
        const nameField = new FieldDesriptor('name')
          .joi('Will Fail', Joi.string().required());
        nameField.validate();
        expect(nameField.valid).to.be.false;
      });
    });

    describe('#joi', () => {
      {
        const nameField = new FieldDesriptor('name');
        nameField
          .joi('Should pass', Joi.any())
          .joi('Required', Joi.string().required())
          .joi('Is Foo', Joi.valid('Foo'));

        it('adds a validator to field.validations', () => {
          expect(nameField.validations).to.have.lengthOf(3);
        });

        it('executes the joi schema against the fields value', () => {
          expect(nameField.validate()).to.be.false;
        });

        it('adds errors to #errors', () => {
          expect(nameField.errors).to.contain('Required');
        });

        it('skips validations after the first fails', () => {
          expect(nameField.errors).to.not.contain('Is Foo');
        });
      }

      it('renders a default error message if no content give', () => {
        const nameField = new FieldDesriptor('name');
        nameField.joi(Joi.string().required());
        nameField.validate();
        expect(nameField.errors).to.contain('No error content for name');
      });
    });
  });
});
