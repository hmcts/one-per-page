const { expect, sinon } = require('../util/chai');
const { FieldValue } = require('../../src/forms/fieldValue');
const { FieldDescriptor } = require('../../src/forms/fieldDescriptor');
const Joi = require('joi');

describe('forms/fieldDescriptor', () => {
  describe('FieldDescriptor', () => {
    describe('#constructor', () => {
      it('defaults #validations to []', () => {
        const f = new FieldDescriptor();
        expect(f.validations).to.eql([]);
      });

      it('sets #parser', () => {
        const parser = () => { /* intentionally blank */ };
        const f = new FieldDescriptor({ parser });
        expect(f).to.have.property('parser', parser);
      });

      it('sets #deserializer', () => {
        const deserializer = () => { /* intentionally blank */ };
        const f = new FieldDescriptor({ deserializer });
        expect(f).to.have.property('deserializer', deserializer);
      });
    });

    describe('#parse', () => {
      {
        const body = { name: 'Name' };
        const serializer = () => { /* intentionally blank */ };

        const f = new FieldDescriptor({ serializer });
        f.joi('An error message', Joi.any());

        const val = f.parse('name', body);

        it('returns a FieldValue', () => {
          expect(val).an.instanceof(FieldValue);
        });

        it('FieldValue#value contains the parsed value', () => {
          expect(val).to.have.property('value', 'Name');
        });

        it('FieldValue#validations contains the validations', () => {
          expect(val).to.have.property('validations', f.validations);
        });

        it('FieldValue#serializer contains the serializer', () => {
          expect(val).to.have.property('serializer', f.serializer);
        });
      }

      it('calls the provided parser to parse the value', () => {
        const parser = sinon.stub().returns('Fake Value');
        const f = new FieldDescriptor({ parser });
        f.parse('key', {});
        expect(parser).calledWith('key', {});
      });
    });

    describe('#deserialize', () => {
      {
        const session = { name: 'Name' };
        const serializer = () => { /* intentionally blank */ };

        const f = new FieldDescriptor({ serializer });
        f.joi('An error message', Joi.any());

        const val = f.deserialize('name', session);

        it('returns a FieldValue', () => {
          expect(val).an.instanceof(FieldValue);
        });

        it('FieldValue#value contains the deserialized value', () => {
          expect(val).to.have.property('value', 'Name');
        });

        it('FieldValue#validations contains the validations', () => {
          expect(val).to.have.property('validations', f.validations);
        });

        it('FieldValue#serializer contains the serializer', () => {
          expect(val).to.have.property('serializer', f.serializer);
        });
      }

      it('calls the provided parser to parse the value', () => {
        const deserializer = sinon.stub().returns('Fake Value');
        const f = new FieldDescriptor({ deserializer });
        f.deserialize('key', {});
        expect(deserializer).calledWith('key', {});
      });
    });

    describe('#joi', () => {
      it('adds a joi validator to #validations', () => {
        const f = new FieldDescriptor();
        f.joi('Error Message', Joi.string().required());
        expect(f.validations).to.have.length(1);
      });
    });
  });
});
