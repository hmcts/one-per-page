const { fieldDescriptor } = require('./fieldDescriptor');
const option = require('option');
const {
  ObjectFieldValue,
  ListFieldValue,
  TransformFieldValue
} = require('./fieldValue');
const { defined, ensureArray } = require('../util/checks');
const { mapEntries, flattenObject } = require('../util/ops');
const { errorFor } = require('./validator');
const Joi = require('joi');

const object = childFields => fieldDescriptor({
  parser(name, body) {
    const fields = mapEntries(childFields, (key, field) => {
      const fieldName = `${name}.${key}`;
      return field.parse(fieldName, body);
    });

    return ObjectFieldValue.from({ name, fields }, this);
  },
  deserializer(name, values) {
    const obj = option
      .fromNullable(values[name])
      .valueOrElse({});

    const fields = mapEntries(childFields, (key, field) => {
      const fieldName = `${name}.${key}`;
      const value = { [fieldName]: obj[key] };
      return field.deserialize(fieldName, value);
    });

    return ObjectFieldValue.from({ name, fields }, this);
  },
  serializer(field) {
    const serialized = mapEntries(field.fields, (key, childField) => {
      const fieldName = `${field.name}.${key}`;
      return childField.serialize()[fieldName];
    });

    if (Object.keys(serialized).length === 0) {
      return {};
    }
    return { [field.name]: serialized };
  }
});

const list = field => fieldDescriptor({
  parser(name, body) {
    const arr = option
      .fromNullable(body[name])
      .map(ensureArray)
      .valueOrElse([]);

    const fields = arr
      .map((value, i) => {
        const fieldName = `${name}[${i}]`;
        return { [i]: field.parse(fieldName, { [fieldName]: value }) };
      })
      .reduce(flattenObject, {});

    return ListFieldValue.from({ name, fields }, this);
  },
  deserializer(name, values) {
    const arr = option
      .fromNullable(values[name])
      .valueOrElse([]);

    const fields = arr
      .map((value, i) => {
        const fieldName = `${name}[${i}]`;
        const fieldValue = field.deserialize(fieldName, { [fieldName]: value });
        return { [i]: fieldValue };
      })
      .reduce(flattenObject, {});

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

const ref = (step, field) => fieldDescriptor({
  parser(name, _, req) {
    return option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[step.name]))
      .flatMap(values => field.deserializer(name, values));
  },
  deserializer(name, _, req) {
    return option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[step.name]))
      .flatMap(values => field.deserializer(name, values));
  },
  serializer() {
    return {};
  }
});

const convert = (transformation, field) => fieldDescriptor({
  parser(name, body, req) {
    return TransformFieldValue.from(
      { transformation, field: field.parse(name, body, req) },
      this
    );
  },
  deserializer(name, values, req) {
    return TransformFieldValue.from(
      { transformation, field: field.deserialize(name, values, req) },
      this
    );
  }
});

const date = object({ day: text, month: text, year: text });
date.required = ({
  allRequired = 'Enter a date',
  dayRequired = 'Enter a day',
  monthRequired = 'Enter a month',
  yearRequired = 'Enter a year'
} = {}) => date
  .joi(
    errorFor('day', dayRequired),
    Joi.object()
      .with('year', 'day')
      .with('month', 'day')
  )
  .joi(
    errorFor('month', monthRequired),
    Joi.object()
      .with('year', 'month')
      .with('day', 'month')
  )
  .joi(
    errorFor('year', yearRequired),
    Joi.object()
      .with('day', 'year')
      .with('month', 'year')
  )
  .joi(
    allRequired,
    Joi.object().keys({
      day: Joi.string().required(),
      month: Joi.string().required(),
      year: Joi.string().required()
    })
  );

module.exports = { nonEmptyText, text, bool, list, object, ref, date, convert };
