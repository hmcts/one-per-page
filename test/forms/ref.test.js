const { expect } = require('../util/chai');
const { FieldDesriptor } = require('../../src/forms/field');
const { ref, Reference } = require('../../src/forms/ref');
const { textParser } = require('../../src/forms/fieldParsers');

describe('forms/ref', () => {
  const fakeStep = { name: 'RefStep' };

  describe('#ref', () => {
    it('returns a Reference', () => {
      const r = ref(fakeStep, 'foo', textParser);
      expect(r).to.be.an.instanceof(Reference);
    });
  });

  describe('Reference', () => {
    it('is an instance of FieldDesriptor', () => {
      const r = new Reference(fakeStep, 'foo', textParser);
      expect(r).to.be.an.instanceof(FieldDesriptor);
    });

    ['parse', 'deserialize'].forEach(func => {
      describe(`#${func}`, () => {
        it('loads from session from it\'s step not the current step', () => {
          const r = new Reference(fakeStep, 'foo', textParser);
          const req = {
            currentStep: { name: 'OtherStep' },
            session: { RefStep_foo: 'ref step' },
            body: { OtherStep_foo: 'other step' }
          };
          r[func](req);
          expect(r.value).to.eql('ref step');
        });

        it('loads from session instead of the request body', () => {
          const r = new Reference(fakeStep, 'foo', textParser);
          const req = {
            currentStep: { name: 'OtherStep' },
            session: { RefStep_foo: 'from session' },
            body: { RefStep_foo: 'from body' }
          };
          r[func](req);
          expect(r.value).to.eql('from session');
        });
      });
    });

    describe('#serialize', () => {
      it('returns empty (preventing saving to the session)', () => {
        const r = new Reference(fakeStep, 'foo', textParser);
        r.value = 'foo';
        r.id = 'foo';
        expect(r.serialize()).to.eql({});
      });
    });
  });
});
