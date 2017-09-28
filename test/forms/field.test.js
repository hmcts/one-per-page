const { expect, sinon } = require('../util/chai');
const { field, FieldDesriptor } = require('../../src/forms');

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

        it('sets errors to if a validator fails', () => {
          const invalidValidator = sinon.stub().returns(errorMessage);
          const foo = new FieldDesriptor('foo').validate(invalidValidator);

          const isValid = foo.validate();

          expect(isValid).to.eql(false);
          expect(foo.errors).to.contain(errorMessage);
          expect(invalidValidator).to.have.been.calledOnce;
        });
      });
    });

    describe('#content', () => {
      const content = { title: 'some title' };

      it('sets and gets the content for the field', () => {
        const foo = new FieldDesriptor('foo');
        foo.content(content);
        expect(foo.content).to.eql(content);
      });
    });
  });
});
