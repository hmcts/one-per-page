const { expect } = require('../util/chai');
const forms = require('../../src/forms');
const { Reference } = require('../../src/forms/ref');
const { FieldDesriptor } = require('../../src/forms/field');
const { Form } = require('../../src/forms/newForm');
const parsers = require('../../src/forms/fieldParsers');

describe('@hmcts/one-per-page/forms', () => {
  [
    { field: 'field', parser: 'nonEmptyTextParser', ref: false },
    { field: 'textField', parser: 'textParser' },
    { field: 'arrayField', parser: 'arrayParser' },
    { field: 'nonEmptyTextField', parser: 'nonEmptyTextParser' }
  ].forEach(({ field, parser, ref = true }) => {
    describe(`#${field}`, () => {
      it(`creates a FieldDesriptor with ${parser}`, () => {
        const f = forms[field]('foo');
        expect(f).to.be.an.instanceof(FieldDesriptor);
        expect(f.parser).to.eql(parsers[parser]);
      });

      if (ref) {
        describe('#ref', () => {
          it(`creates a Reference with ${parser}`, () => {
            const f = forms[field].ref({}, 'foo');
            expect(f).to.be.an.instanceof(Reference);
            expect(f.parser).to.eql(parsers[parser]);
          });
        });
      }
    });
  });

  describe('#form', () => {
    it('creates a Form', () => {
      expect(forms.form()).to.be.an.instanceof(Form);
    });
  });
});
