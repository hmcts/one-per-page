const { expect } = require('../util/chai');
const {
  field,
  FieldDesriptor,
  ParsedField
} = require('../../src/services/fields');

describe('services/fields', () => {
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

    describe('#parse', () => {
      it('returns a ParsedField', () => {
        const foo = new FieldDesriptor('first_name');
        expect(foo.parse({})).to.be.an.instanceof(ParsedField);
      });

      it('fills ParsedField.value with answer from the session', () => {
        const req = {
          session: { NameStep_firstName: 'Michael' },
          currentStep: { name: 'NameStep' }
        };
        const firstName = new FieldDesriptor('firstName');
        expect(firstName.parse(req)).to.have.property('value', 'Michael');
      });

      it('fills ParsedField.value with answer from request body', () => {
        const req = {
          body: { NameStep_firstName: 'Michael' },
          currentStep: { name: 'NameStep' }
        };
        const firstName = new FieldDesriptor('firstName');
        expect(firstName.parse(req)).to.have.property('value', 'Michael');
      });

      it('prefers answer from request body over session', () => {
        const req = {
          body: { NameStep_firstName: 'Michael' },
          session: { NameStep_firstName: 'John' },
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
  });

  describe('ParsedField', () => {
    it('stores name, id and parsed value', () => {
      const f = new ParsedField('my_name', 'my_id', 'my value');
      expect(f).to.have.property('name', 'my_name');
      expect(f).to.have.property('id', 'my_id');
      expect(f).to.have.property('value', 'my value');
    });
  });
});
