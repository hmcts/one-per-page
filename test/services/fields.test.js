const { expect, sinon } = require('../util/chai');
const {
  field,
  FieldDesriptor,
  ParsedField,
  form,
  Form
} = require('../../src/services/fields');

describe('services/fields', () => {
  describe('#field', () => {
    it('returns a FieldDesriptor', () => {
      const foo = field('foo');
      expect(foo).to.be.an.instanceof(FieldDesriptor);
    });
  });

  describe('#form', () => {
    it('returns a Form', () => {
      const f = form(field('foo'));
      expect(f).to.be.an.instanceof(Form);
      expect(f.fields).to.eql([field('foo')]);
    });

    it('is happy with no fields', () => {
      const f = form();
      expect(f).to.be.an.instanceof(Form);
      expect(f.fields).to.eql([]);
    });
  });

  describe('Form', () => {
    it('accepts an array of fields', () => {
      const fields = [field('foo'), field('bar')];
      const f = new Form(fields);
      expect(f).to.have.property('fields').that.eql(fields);
    });

    describe('#parse', () => {
      it('calls field.parse on each field', () => {
        const fields = [field('foo'), field('bar')];
        const f = new Form(fields);
        const req = { currentStep: {} };

        fields.forEach(_field => sinon.spy(_field, 'parse'));
        f.parse(req);
        fields.forEach(_field => expect(_field.parse).calledOnce);
      });

      it('returns an array of ParsedFields', () => {
        const f = new Form([]);
        const req = { currentStep: {} };
        const parsed = f.parse(req);
        expect(parsed).to.be.an('array');
      });
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
          body: {},
          session: { NameStep_firstName: 'Michael' },
          currentStep: { name: 'NameStep' }
        };
        const firstName = new FieldDesriptor('firstName');
        expect(firstName.parse(req)).to.have.property('value', 'Michael');
      });

      it('fills ParsedField.value with answer from request body', () => {
        const req = {
          body: { NameStep_firstName: 'Michael' },
          session: {},
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
