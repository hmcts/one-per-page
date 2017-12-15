const { fieldDescriptor } = require('./fieldDescriptor');
const option = require('option');
const { FieldValue } = require('./fieldValue');

class ListFieldValue extends FieldValue {
  constructor(args) {
    const fields = args.value;
    delete args.value;
    super(args);

    this.fields = fields;
    Object.keys(fields).forEach(key => {
      this[key] = this.fields[key];
    });
  }

  get value() {
    return Object.values(this.fields).map(field => field.value);
  }
}
const listValue = args => new ListFieldValue(args);

const list = field => fieldDescriptor({
  produces: listValue,
  parser(name, body) {
    const r = `${name}\\.(\\d{1,})`;
    const indexes = Object.keys(body)
      .filter(str => str.match(r))
      .map(str => str.match(r)[1])
      .map(str => parseInt(str));

    const length = Math.max(...indexes) + 1;
    const fields = Array(length).fill(length)
      .map((_, i) => field.parse(`${name}.${i}`, body));

    return fields.reduce((obj, currentField, i) => {
      obj[i] = currentField;
      return obj;
    }, {});
  },
  deserializer(name, values) {
    const arr = option
      .fromNullable(values[name])
      .valueOrElse([]);

    return arr
      .map((value, i) => {
        const fieldName = `${name}.${i}`;
        return field.deserialize(fieldName, { [fieldName]: value });
      })
      .reduce((obj, current, i) => {
        obj[i] = current;
        return obj;
      }, {});
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
      .fromNullable(body[name])
      .map(val => val.toString())
      .filter(str => str !== '')
      .valueOrElse(undefined); // eslint-disable-line no-undefined
  },
  deserializer(name, values) {
    return option
      .fromNullable(values[name])
      .map(val => val.toString())
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

module.exports = { nonEmptyText, text, bool, list };
