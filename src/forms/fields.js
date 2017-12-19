const { fieldDescriptor } = require('./fieldDescriptor');
const option = require('option');
const { FieldValue } = require('./fieldValue');
const { defined } = require('../util/checks');

const intoObject = (obj, { key, value }) => {
  Object.assign(obj, { [key]: value });
  return obj;
};

class ObjectFieldValue extends FieldValue {
  constructor({ id, name, serializer, validations, fields = [] }) {
    super({ id, name, serializer, validations });

    this.fields = fields;
    Object.keys(fields).forEach(key => {
      this[key] = this.fields[key];
    });
  }

  get value() {
    return Object
      .keys(this.fields)
      .map(key => {
        return { key, value: this.fields[key].value };
      })
      .filter(({ value }) => defined(value))
      .reduce(intoObject, {});
  }
}

class ListFieldValue extends ObjectFieldValue {
  get value() {
    return Object.values(this.fields).map(field => field.value);
  }
}

const object = childFields => fieldDescriptor({
  parser(name, body) {
    const keys = Object.keys(childFields);

    const fields = keys
      .map(key => {
        const fieldName = `${name}.${key}`;
        return { key, value: childFields[key].parse(fieldName, body) };
      })
      .reduce(intoObject, {});

    return ObjectFieldValue.from({ name, fields }, this);
  },
  deserializer(name, values) {
    const obj = option
      .fromNullable(values[name])
      .valueOrElse({});

    const fields = Object.keys(childFields)
      .map(key => {
        const fieldName = `${name}.${key}`;
        const value = { [fieldName]: obj[key] };
        return {
          key,
          value: childFields[key].deserialize(fieldName, value)
        };
      })
      .reduce(intoObject, {});

    return ObjectFieldValue.from({ name, fields }, this);
  },
  serializer(field) {
    const serializedFields = Object.entries(field.fields)
      .map(([name, childField]) => {
        const fieldName = `${field.name}.${name}`;
        return { key: name, value: childField.serialize()[fieldName] };
      })
      .filter(({ value }) => defined(value));

    if (serializedFields.length === 0) {
      return {};
    }
    return { [field.name]: serializedFields.reduce(intoObject, {}) };
  }
});

const list = field => fieldDescriptor({
  parser(name, body) {
    const r = `${name}\\.(\\d{1,})`;
    const indexes = Object.keys(body)
      .filter(str => str.match(r))
      .map(str => str.match(r)[1])
      .map(str => parseInt(str));

    const length = Math.max(...indexes) + 1;
    const fields = Array(length).fill(length)
      .map((_, i) => {
        return { key: i, value: field.parse(`${name}.${i}`, body) };
      })
      .reduce(intoObject, {});

    return ListFieldValue.from({ name, fields }, this);
  },
  deserializer(name, values) {
    const arr = option
      .fromNullable(values[name])
      .valueOrElse([]);

    const fields = arr
      .map((value, i) => {
        const fieldName = `${name}.${i}`;
        const fieldValue = field.deserialize(fieldName, { [fieldName]: value });
        return { key: i, value: fieldValue };
      })
      .reduce(intoObject, {});

    return ListFieldValue.from({ name, fields }, this);
  },
  serializer(f) {
    if (f.value.length === 0) {
      return {};
    }
    return { [f.name]: f.value };
  }
});

const nonEmptyText = fieldDescriptor({
  parser(name, body) {
    return option
      .fromNullable(body[name])
      .map(val => val.toString())
      .valueOrElse('');
  },
  deserializer(name, values) {
    return option
      .fromNullable(values[name])
      .map(val => val.toString())
      .valueOrElse('');
  }
});

const text = fieldDescriptor({
  parser(name, body) {
    return option
      .fromNullable(nonEmptyText.parser(name, body))
      .filter(str => str !== '')
      .valueOrElse(undefined); // eslint-disable-line no-undefined
  },
  deserializer(name, values) {
    return option
      .fromNullable(nonEmptyText.deserializer(name, values))
      .filter(str => str !== '')
      .valueOrElse(undefined); // eslint-disable-line no-undefined
  }
});

const truthy = ['yes', 'y', 'true', 't', '1'];
const falsey = ['no', 'n', 'false', 'f', '0'];

const bool = fieldDescriptor({
  parser(name, body) {
    return option
      .fromNullable(body[name])
      .map(val => val.toString().toLowerCase())
      .flatMap(val => {
        if (truthy.includes(val)) {
          return option.some(true);
        } else if (falsey.includes(val)) {
          return option.some(false);
        }
        return option.none;
      })
      .valueOrElse(undefined); // eslint-disable-line no-undefined
  }
});
bool.default = defaultValue => fieldDescriptor({
  parser(name, body) {
    const parsed = bool.parser(name, body);
    if (defined(parsed)) return parsed;
    return defaultValue;
  }
});

module.exports = { nonEmptyText, text, bool, list, object };
