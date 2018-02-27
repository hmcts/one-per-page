const { expect } = require('../../util/chai');
const { RefValue, FieldValue } = require('../../../src/forms/fieldValue');

describe('forms/fieldValue', () => {
  describe('RefValue', () => {
    describe('#isFilled', () => {
      it("always returns false (refs aren't values produced by steps)", () => {
        const f = new FieldValue({ id: 'id', name: 'name', value: 'value' });
        const ref = RefValue.wrap(f);
        expect(ref.isFilled).to.be.false;
      });
    });

    describe('#serialize', () => {
      it('returns an empty object', () => {
        const f = new FieldValue({ id: 'id', name: 'name', value: 'value' });
        const ref = RefValue.wrap(f);
        expect(ref.serialize()).to.eql({});
      });
    });
  });
});
