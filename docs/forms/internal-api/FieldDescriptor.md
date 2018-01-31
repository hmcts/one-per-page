# FieldDescriptor

FieldDescriptors are objects that understand how to deserialize or parse values
and store validations that should be applied to those values.

> [`text`], [`list`], [`bool`], [`date`], etc are all FieldDescriptors

FieldDescriptors should avoid mutation as much as possible as mutation would
make sharing FieldDescriptors harder. To ensure this, any FieldDescriptors you
create that wrap or add functionality to other FieldDescriptors should use
[`clone(overrides)`]

## API

### `constructor(args)`

- __Returns__ an instance of FieldDescriptor
- __Expects__ `args` to be a JSON object
- __Defaults__ `args.parser` to a parser that returns undefined if no value found
- __Defaults__ `args.deserializer` to a parser that returns undefined if no value found
- __Defaults__ `args.validations` to an empty array

### `clone(overrides)`

- __Returns__ an instance of FieldDescriptor

Clones the current instance and prefers any fields given in `overrides`.

### `parse(name, values, request)`

- __Returns__ an instance of [`FieldValue`]

Uses the `parser` provided in construction to pluck it's value from the given
`values`.

### `deserialize(name, values, request)`

- __Returns__ an instance of [`FieldValue`]

Uses the `deserializer` provided in construction to pluck it's value from the
given `values`.

### `checkField(target|error, predicate)`

- __Returns__ an instance of FieldDescriptor
- __Expects__ `target|error` to be either a string error message or an object `{ id: string, message: string }`
- __Expects__ `predicate` to be a function of `(FieldValue) => boolean`

Clones the current instance and with a validator added to it's list of
validations.

Your predicate will be given the entire FieldValue and should return true if
your check holds.

### `check(target|error, predicate)`

- __Returns__ an instance of FieldDescriptor
- __Expects__ `target|error` to be either a string error message or an object `{ id: string, message: string }`
- __Expects__ `predicate` to be a function of `(value) => boolean`

Clones the current instance with a new validator added to it's list of
validations.

Your predicate will be given the FieldValues value and should return true if
your check holds.

### `joi(target|error, validator)`

- __Returns__ an instance of FieldDescriptor
- __Expects__ `target|error` to be either a string error message or an object `{ id: string, message: string }`
- __Expects__ `validator` to be a Joi validator object

Clones the current instance adding a new validator that will execute the joi
validator against the FieldValues value.

[`FieldValue`]: /docs/forms/internal-api/FieldValue
[`text`]: /docs/forms/field-types#text
[`list`]: /docs/forms/field-types#list-fieldType
[`bool`]: /docs/forms/field-types#bool
[`date`]: /docs/forms/field-types#date
[`clone(overrides)`]: #clone-overrides
