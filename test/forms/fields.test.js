const { expect } = require('../util/chai');
const {
  text, nonEmptyText,
  bool,
  list, appendToList,
  object,
  ref,
  convert,
  date
} = require('../../src/forms/fields');
const { defined, isObject, isEmptyObject } = require('../../src/util/checks');

const readable = value => {
  if (typeof value === 'object') return JSON.stringify(value);
  if (value === 'value missing') return value;
  if (value === '') return '""';
  if (typeof value === 'string') return `"${value}"`;
  return value;
};

const fieldTest = (field, tests) => {
  const deserializes = ({
    from = {}, value, key = 'foo', only = false, req = {},
    assertions = ({ fieldValue }) => {
      expect(fieldValue.value).to.eql(value);
    }
  }) => {
    const fromStr = readable(from);
    const toStr = readable(value);
    const reqStr = isEmptyObject(req) ? '' : ` with request ${readable(req)}`;
    const mochaTest = only ? it.only : it;

    mochaTest(`deserializes ${toStr} from ${fromStr}${reqStr}`, () => {
      const session = isObject(from) ? from : { [key]: from };
      const fieldValue = field.deserialize(key, session, req);
      return assertions({ fieldValue, field });
    });
  };
  const parses = ({
    from = {}, to, key = 'foo', only = false, req = {},
    assertions = ({ fieldValue }) => {
      expect(fieldValue.value).to.eql(to);
    }
  }) => {
    const fromStr = readable(from);
    const toStr = readable(to);
    const reqStr = isEmptyObject(req) ? '' : ` with request ${readable(req)}`;
    const mochaTest = only ? it.only : it;

    mochaTest(`parses ${toStr} from ${fromStr}${reqStr}`, () => {
      const body = isObject(from) ? from : { [key]: from };
      const fieldValue = field.parse(key, body, req);
      return assertions({ fieldValue, field });
    });
  };
  const serializes = ({
    from, to, key = 'foo', only = false, req = {},
    assertions = ({ serializedValue }) => {
      const serialized = isObject(to) ? to : { [key]: to };
      expect(serializedValue).to.eql(serialized);
    }
  }) => {
    const fromStr = readable(from);
    const toStr = readable(to);
    const reqStr = isEmptyObject(req) ? '' : ` with request ${readable(req)}`;
    const mochaTest = only ? it.only : it;

    mochaTest(`serializes ${toStr} from ${fromStr}${reqStr}`, () => {
      let fieldValue = {};
      if (defined(from)) {
        const values = isObject(from) ? from : { [key]: from };
        fieldValue = field.deserialize(key, values, req);
      } else if (defined(req.body)) {
        fieldValue = field.parse(key, req.body, req);
      } else {
        throw new Error('Provide req.body to parse or from to deserialize');
      }
      const existingValues = defined(req.session) ? req.session : {};
      const serializedValue = fieldValue.serialize(existingValues);
      return assertions({ fieldValue, field, serializedValue });
    });
  };

  const only = {
    serializes: args => serializes(Object.assign(args, { only: true })),
    deserializes: args => deserializes(Object.assign(args, { only: true })),
    parses: args => parses(Object.assign(args, { only: true }))
  };

  return () => tests({ deserializes, parses, serializes, only });
};


describe('forms/fields', () => {
  describe('nonEmptyText', fieldTest(nonEmptyText, it => {
    it.deserializes({ value: '', from: '' });
    it.deserializes({ value: 'value', from: 'value' });
    it.deserializes({ value: '', from: {} });

    it.parses({ to: 'value', from: 'value' });
    it.parses({ to: '1', from: 1 });
    it.parses({ to: '', from: '' });
    it.parses({ to: '', from: undefined });
    it.parses({ to: '', from: {} });

    it.serializes({ to: '', from: '' });
    it.serializes({ to: 'value', from: 'value' });
  }));

  describe('text', fieldTest(text, it => {
    it.deserializes({ value: undefined, from: '' });
    it.deserializes({ value: 'value', from: 'value' });
    it.deserializes({ value: undefined, from: {} });

    it.parses({ to: 'value', from: 'value' });
    it.parses({ to: '1', from: 1 });
    it.parses({ to: undefined, from: '' });
    it.parses({ to: undefined, from: undefined });
    it.parses({ to: undefined, from: {} });

    it.serializes({ to: {}, from: '' });
    it.serializes({ to: 'value', from: 'value' });
  }));

  describe('bool', fieldTest(bool, it => {
    it.parses({ to: undefined, from: {} });
    it.parses({ to: undefined, from: 'nonsense' });
    it.parses({ to: undefined, from: {} });
    it.parses({ to: undefined, from: [] });

    it.parses({ to: true, from: true });
    it.parses({ to: true, from: 'true' });
    it.parses({ to: true, from: 'YES' });
    it.parses({ to: true, from: 'yes' });
    it.parses({ to: true, from: 1 });
    it.parses({ to: true, from: '1' });

    it.parses({ to: false, from: false });
    it.parses({ to: false, from: 'false' });
    it.parses({ to: false, from: 'NO' });
    it.parses({ to: false, from: 'no' });
    it.parses({ to: false, from: 0 });
    it.parses({ to: false, from: '0' });

    it.deserializes({ value: undefined, from: {} });
    it.deserializes({ value: true, from: true });
    it.deserializes({ value: false, from: false });

    it.serializes({ to: {}, from: {} });
    it.serializes({ to: true, from: true });
    it.serializes({ to: false, from: false });
  }));

  describe('bool.default(true)', fieldTest(bool.default(true), it => {
    it.parses({ to: true, from: undefined });
    it.parses({ to: true, from: {} });
    it.parses({ to: true, from: 'nonsense' });
    it.parses({ to: true, from: {} });
    it.parses({ to: true, from: [] });

    it.parses({ to: true, from: true });
    it.parses({ to: false, from: false });
  }));

  describe('bool.default(false)', fieldTest(bool.default(false), it => {
    it.parses({ to: false, from: undefined });
    it.parses({ to: false, from: {} });
    it.parses({ to: false, from: 'nonsense' });
    it.parses({ to: false, from: {} });
    it.parses({ to: false, from: [] });

    it.parses({ to: true, from: true });
    it.parses({ to: false, from: false });
  }));

  describe('list(bool)', fieldTest(list(bool), it => {
    it.parses({ to: [true], from: { foo: 'true' } });
    it.parses({ to: [true], from: { foo: ['true'] } });
    it.parses({ to: [true, false], from: { foo: ['true', 'no'] } });

    it.deserializes({ value: [], from: {} });
    it.deserializes({ value: [true], from: [true] });
    it.deserializes({ value: [true, false], from: [true, false] });

    it.serializes({ to: {}, from: [] });
    it.serializes({ to: [true], from: [true] });
    it.serializes({ to: [true, false], from: [true, false] });
  }));

  describe('list(text)', fieldTest(list(text), it => {
    it.parses({ to: ['Foo'], from: { foo: 'Foo' } });
    it.parses({ to: ['Foo'], from: { foo: ['Foo'] } });
    it.parses({ to: ['Foo', 'Bar'], from: { foo: ['Foo', 'Bar'] } });

    it.deserializes({ value: ['Foo'], from: ['Foo'] });
    it.deserializes({ value: ['Foo', 'Bar'], from: ['Foo', 'Bar'] });

    it.serializes({ to: ['Foo'], from: ['Foo'] });
    it.serializes({ to: ['Foo', 'Bar'], from: ['Foo', 'Bar'] });
  }));

  describe('appendToList([list], [index], text)', fieldTest(
    appendToList('items', 1, text), it => {
      it.parses({ to: 'foo', from: 'foo' });
      it.deserializes({
        value: 'target from session',
        from: { items: ['other', 'target from session'] }
      });
      it.serializes({
        to: { items: ['from session', 'from body'] },
        req: {
          body: { foo: 'from body' },
          session: { items: ['from session'] }
        }
      });
      it.serializes({
        to: { items: ['from session'] },
        req: {
          body: {},
          session: { items: ['from session'] }
        }
      });
      it.serializes({
        to: { items: ['from body'] },
        req: {
          body: { foo: 'from body' },
          session: {}
        }
      });
    })
  );

  const objectWithChildren = object({ a: text, b: bool });
  describe('object({ a: text, b: bool })', fieldTest(objectWithChildren, it => {
    it.parses({ to: {}, from: {} });
    it.parses({
      to: { a: 'A text field', b: true },
      from: { 'foo.a': 'A text field', 'foo.b': 'true' }
    });
    it.parses({
      to: { a: 'A text field' },
      from: { 'foo.a': 'A text field' }
    });

    it.deserializes({
      value: { a: 'A text field', b: true },
      from: { foo: { a: 'A text field', b: true } }
    });
    it.deserializes({
      value: {},
      from: { foo: {} }
    });
    it.deserializes({
      from: { foo: { a: 'A text field', b: true } },
      assertions({ fieldValue }) {
        expect(fieldValue).to.have.property('a');
        expect(fieldValue).to.have.property('b');
        expect(fieldValue.a).to.have.property('value', 'A text field');
        expect(fieldValue.b).to.have.property('value', true);
      }
    });

    it.serializes({
      to: { foo: { a: 'A text field', b: true } },
      from: { foo: { a: 'A text field', b: true } }
    });
    it.serializes({
      to: { foo: { a: 'A text field' } },
      from: { foo: { a: 'A text field' } }
    });
    it.serializes({
      to: {},
      from: { foo: {} }
    });
  }));

  const myStep = { name: 'MyStep' };
  describe('ref([step], text)', fieldTest(ref(myStep, text), it => {
    const req = { session: { MyStep: { foo: 'From another step' } } };

    it.parses({ to: 'From another step', req });
    it.deserializes({ value: 'From another step', req });
    it.serializes({ to: {}, from: {}, req });
  }));

  const toUpper = convert(str => str.toUpperCase(), text);
  describe('convert(() => {}, text)', fieldTest(toUpper, it => {
    it.parses({ to: 'FOO', from: 'foo' });
    it.deserializes({ value: 'FOO', from: 'foo' });
    it.serializes({ to: 'foo', from: 'foo' });
  }));

  describe('date', fieldTest(date, it => {
    it.parses({ to: {}, from: {} });
    it.parses({
      to: { day: '1', month: '12', year: '2017' },
      from: { 'foo.day': '1', 'foo.month': '12', 'foo.year': '2017' }
    });

    it.deserializes({
      value: { day: '1', month: '12', year: '2017' },
      from: { foo: { day: '1', month: '12', year: '2017' } }
    });

    it.serializes({
      to: { foo: { day: '1', month: '12', year: '2017' } },
      from: { foo: { day: '1', month: '12', year: '2017' } }
    });
  }));

  describe('date.required', () => {
    it('errors if all fields missing', () => {
      const errored = date.required().parse('date', {});
      errored.validate();
      expect(errored.errors).to.eql(['Enter a date']);
    });
    it('errors if any fields missing', () => {
      const errored = date.required().parse('date', { 'date.month': '1' });
      errored.validate();
      expect(errored.day.errors).to.eql(['Enter a day']);
      expect(errored.year.errors).to.eql(['Enter a year']);
    });
  });
});
