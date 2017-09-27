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
