const { expect } = require('../util/chai');
const {
  checkboxField,
  CheckboxFieldDescriptor
} = require('../../src/forms/checkboxField');
const { FieldDesriptor } = require('../../src/forms/field');

describe('forms/checkboxField', () => {
  describe('#checkboxField', () => {
    it('returns a CheckboxFieldDescriptor', () => {
      const foo = checkboxField('foo');
      expect(foo).to.be.an.instanceof(CheckboxFieldDescriptor);
    });
  });

  describe('CheckboxFieldDescriptor', () => {
    it('extends FieldDesriptor', () => {
      const foo = new CheckboxFieldDescriptor('foo');
      expect(foo).to.be.an.instanceof(FieldDesriptor);
    });

    describe('#parse', () => {
      it('parses field missing to []', () => {
        const field = new CheckboxFieldDescriptor('foo');
        field.parse({ body: {} });
        expect(field.value).to.eql([]);
      });

      it('parses single value to [value]', () => {
        const field = new CheckboxFieldDescriptor('foo');
        field.parse({ body: { foo: 'Foo' } });
        expect(field.value).to.eql(['Foo']);
      });

      it('parses an array of values', () => {
        const field = new CheckboxFieldDescriptor('foo');
        field.parse({ body: { foo: ['Foo', 'Bar'] } });
        expect(field.value).to.eql(['Foo', 'Bar']);
      });
    });

    describe('#deserialize', () => {
      it('deserializes field missing to []', () => {
        const field = new CheckboxFieldDescriptor('foo');
        field.deserialize({ session: {} });
        expect(field.value).to.eql([]);
      });

      it('deserializes an array of values', () => {
        const field = new CheckboxFieldDescriptor('foo');
        field.deserialize({ session: { foo: ['Foo', 'Bar'] } });
        expect(field.value).to.eql(['Foo', 'Bar']);
      });
    });
  });
});
