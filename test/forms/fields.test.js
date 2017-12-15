const { expect } = require('../util/chai');
const { text, nonEmptyText, bool, list } = require('../../src/forms/fields');
const { isObject } = require('../../src/util/checks');

const readable = value => {
  if (typeof value === 'object') return JSON.stringify(value);
  if (value === 'value missing') return value;
  if (value === '') return '""';
  if (typeof value === 'string') return `"${value}"`;
  return value;
};

const fieldTest = (field, tests) => {
  const deserializes = ({ from, to, key = 'foo', only = false }) => {
    const fromStr = readable(from);
    const toStr = readable(to);
    const mochaTest = only ? it.only : it;

    mochaTest(`deserializes ${toStr} from ${fromStr}`, () => {
      const session = isObject(from) ? from : { [key]: from };
      const fieldValue = field.deserialize(key, session);
      expect(fieldValue.value).to.eql(to);
    });
  };
  const parses = ({ from, to, key = 'foo', only = false }) => {
    const fromStr = readable(from);
    const toStr = readable(to);
    const mochaTest = only ? it.only : it;

    mochaTest(`parses ${toStr} from ${fromStr}`, () => {
      const body = isObject(from) ? from : { [key]: from };
      const fieldValue = field.parse(key, body);
      expect(fieldValue.value).to.eql(to);
    });
  };
  const serializes = ({ from, to, key = 'foo', only = false }) => {
    const fromStr = readable(from);
    const toStr = readable(to);
    const mochaTest = only ? it.only : it;

    mochaTest(`serializes ${toStr} from ${fromStr}`, () => {
      const values = isObject(from) ? from : { [key]: from };
      const serialized = isObject(to) ? to : { [key]: to };
      const fieldValue = field.deserialize(key, values);
      expect(fieldValue.serialize()).to.eql(serialized);
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
    it.deserializes({ to: '', from: '' });
    it.deserializes({ to: 'value', from: 'value' });
    it.deserializes({ to: '', from: {} });

    it.parses({ to: 'value', from: 'value' });
    it.parses({ to: '1', from: 1 });
    it.parses({ to: '', from: '' });
    it.parses({ to: '', from: undefined });
    it.parses({ to: '', from: {} });

    it.serializes({ to: '', from: '' });
    it.serializes({ to: 'value', from: 'value' });
  }));

  describe('text', fieldTest(text, it => {
    it.deserializes({ to: undefined, from: '' });
    it.deserializes({ to: 'value', from: 'value' });
    it.deserializes({ to: undefined, from: {} });

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

    it.deserializes({ to: undefined, from: {} });
    it.deserializes({ to: true, from: true });
    it.deserializes({ to: false, from: false });

    it.serializes({ to: {}, from: undefined });
    it.serializes({ to: true, from: true });
    it.serializes({ to: false, from: false });
  }));

  describe('list(bool)', fieldTest(list(bool), it => {
    it.parses({ to: [true], from: { 'foo.0': 'true' } });
    it.parses({
      to: [true, false],
      from: { 'foo.0': 'true', 'foo.1': 'no' }
    });

    it.deserializes({ to: [], from: {} });
    it.deserializes({ to: [true], from: [true] });
    it.deserializes({ to: [true, false], from: [true, false] });

    it.serializes({ to: {}, from: [] });
    it.serializes({ to: [true], from: [true] });
    it.serializes({ to: [true, false], from: [true, false] });
  }));

  describe('list(text)', fieldTest(list(text), it => {
    it.parses({ to: ['Foo'], from: { 'foo.0': 'Foo' } });
    it.parses({
      to: ['Foo', 'Bar'],
      from: { 'foo.0': 'Foo', 'foo.1': 'Bar' }
    });

    it.deserializes({ to: ['Foo'], from: ['Foo'] });
    it.deserializes({ to: ['Foo', 'Bar'], from: ['Foo', 'Bar'] });

    it.serializes({ to: ['Foo'], from: ['Foo'] });
    it.serializes({ to: ['Foo', 'Bar'], from: ['Foo', 'Bar'] });
  }));
});
