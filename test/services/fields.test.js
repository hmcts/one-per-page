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
        const foo = new FieldDesriptor('first_name', 'Michael');
        expect(foo.parse({})).to.be.an.instanceof(ParsedField);
      });
    });
  });

  describe('ParsedField', () => {
    it('stores name and parsed value', () => {
      const f = new ParsedField('my name', 'my value');
      expect(f).to.have.property('name', 'my name');
      expect(f).to.have.property('value', 'my value');
    });
  });
});
