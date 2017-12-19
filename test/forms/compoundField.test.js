const { expect } = require('../util/chai');
const { CompoundField, errorFor } = require('../../src/forms/compoundField');
const FieldError = require('../../src/forms/fieldError');
const { textField } = require('../../src/forms');
const Joi = require('joi');

describe('forms/CompoundField', () => {
  it('attaches each field to CompoundField.[field name]', () => {
    const day = textField('day');
    const month = textField('month');
    const year = textField('year');
    const date = new CompoundField('date', day, month, year);

    expect(date.day).to.eql(day);
    expect(date.month).to.eql(month);
    expect(date.year).to.eql(year);
  });

  describe('#parse', () => {
    it("fills it's child fields from the given body", () => {
      const body = {
        day: '6',
        month: '12',
        year: '2017'
      };
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      );

      date.parse('date', body);
      expect(date.day.value).to.eql(body.day);
      expect(date.month.value).to.eql(body.month);
      expect(date.year.value).to.eql(body.year);
    });
  });

  describe('#deserialize', () => {
    it('deserializes the field from the session', () => {
      const session = {
        date: {
          day: '6',
          month: '12',
          year: '2017'
        }
      };
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      );
      date.deserialize('date', session);
      expect(date.day.value).to.eql(session.date.day);
      expect(date.month.value).to.eql(session.date.month);
      expect(date.year.value).to.eql(session.date.year);
    });
  });

  describe('#serialize', () => {
    it("serializes it's child fields in to an object", () => {
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      );
      date.day.value = '6';
      date.month.value = '12';
      date.year.value = '2017';

      const obj = date.serialize();
      expect(obj).to.eql({ date: { day: '6', month: '12', year: '2017' } });
    });
  });

  describe('#validate', () => {
    it('returns true if validations pass', () => {
      const date = new CompoundField('date',
        textField('day').joi('day error', Joi.number()),
        textField('month').joi('month error', Joi.number()),
        textField('year').joi('year error', Joi.number())
      ).joi('date error', Joi.object().and('day', 'month', 'year'));

      date.parse('date', { day: 1, month: 12, year: 1988 });
      expect(date.validate()).to.be.true;
    });

    it("returns false if it's validations fail", () => {
      const parentWillFail = new CompoundField(
        'parent',
        textField('child')
      ).joi('will fail', Joi.object().keys({ child: Joi.required() }));

      expect(parentWillFail.validate()).to.be.false;
    });

    it('returns false if a child field validation fails', () => {
      const childWillFail = new CompoundField(
        'parent',
        textField('child').joi('will fail', Joi.required())
      );

      expect(childWillFail.validate()).to.be.false;
    });

    it('executes any validations on the child fields', () => {
      const error = name => `${name} is required`;

      const date = new CompoundField('date',
        textField('day').joi(error('day'), Joi.number().required()),
        textField('month').joi(error('month'), Joi.number().required()),
        textField('year').joi(error('year'), Joi.number().required())
      );
      date.validate();
      expect(date.day.errors).to.contain(error('day'));
      expect(date.month.errors).to.contain(error('month'));
      expect(date.year.errors).to.contain(error('year'));
    });

    it("executes it's validations", () => {
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      ).joi(
        'A date is required',
        Joi.object().and('day', 'month', 'year')
      );

      date.parse('date', { day: 10 });
      date.validate();
      expect(date.errors).to.contain('A date is required');
    });

    it('attaches a targeted error to the correct child field', () => {
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      ).joi(
        errorFor('day', 'Day is required'),
        Joi.object()
          .with('year', 'day')
          .with('month', 'day')
      );

      date.parse('date', { year: 2017 });
      date.validate();
      expect(date.day.errors).to.contain('Day is required');
    });
  });

  describe('#mappedErrors', () => {
    it('returns [] if validations passed', () => {
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      ).joi('Will Pass', Joi.any());
      date.validate();
      expect(date.mappedErrors).to.eql([]);
    });

    it('returns FieldErrors if validations passed', () => {
      const date = new CompoundField('date',
        textField('day'),
        textField('month'),
        textField('year')
      ).joi(
        'Will fail',
        Joi.object({
          day: Joi.string().required(),
          month: Joi.string().required(),
          year: Joi.string().required()
        })
      );
      date.validate();
      expect(date.mappedErrors).to.eql([new FieldError(date, 'Will fail')]);
    });

    it('returns FieldErrors for child fileds', () => {
      const date = new CompoundField('date',
        textField('day').joi('Will fail', Joi.string().required()),
        textField('month').joi('Will fail', Joi.string().required()),
        textField('year').joi('Will fail', Joi.string().required())
      );
      date.validate();
      expect(date.mappedErrors).to.eql([
        new FieldError(date.day, 'Will fail'),
        new FieldError(date.month, 'Will fail'),
        new FieldError(date.year, 'Will fail')
      ]);
    });
  });
});
