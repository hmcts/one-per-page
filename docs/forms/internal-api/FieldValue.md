# FieldValue

FieldValues are produced by a [`FieldDescriptor`] when it parses or deserializes
a value. FieldValue stores the loaded value alongside any validations that should
be applied to it and a method of serializing that value.

## Behaviour

### Validate it's value

FieldValues are given a list of validations by the FieldDescriptor that creates
them. When validation is performed the FieldValue executes these validations
and stores any error messages that resulted from any failures.

```js
const applicationType = text.check(
  'Must be one of Divorce, Separation or Annulment',
  value => ['divorce', 'separation', 'annulment'].includes(value)
);
// applicationType is a new FieldValue with a validation attached

const filled = applicationType.parse('type', { type: 'foo' });
// filled is a FieldValue with a validation attached

filled.validate()
// returns false as the filled type is not a valid answer
```

### Serialize it's value

FieldValues are given a serializer function during construction that will be
used to serialize the FieldValue in to a JSON object. Most fields produce
FieldValues that omit their key from the JSON object if the value is undefined.

```js
const fieldValue = new FieldValue({ name: 'preferredBisuit', value: 'hob-nob' });
fieldValue.serialize()
// returns { preferredBiscuit: 'hob-nob' }

const missingValue = new FieldValue({ name: 'preferredTea' });
fieldValue.serialize()
// returns {}
```

You can override this behaviour by providing a function of the shape 
`serializer(FieldValue): object`. Some fields use this to create fields that
will append their values to an existing list from session or not output at all,
creating a readonly FieldValue.

## API

### `constructor(args)`

- __Returns__ a FieldValue
- __Expects__ `args.name` to be a string
- __Defaults__ `args.id` to `args.name`
- __Optional__ `args.value`
- __Defaults__ `args.validations` to an empty array
- __Defaults__ `args.serializer` to a serializer that omits the value if it is undefined

Serializers are expected to be a function of the form `(FieldValue) => { JSON Object }`.

### `static from(args, fieldDescriptor)`

- __Returns__ a [`FieldDescriptor`]
- __Expects__ `args` to be an object with `id`, `name`, `value`

Calls [`constructor(args)`] with the given args and the `validations` and
`serializer` of the given [`FieldDescriptor`].

This is provided as a convenience function to make creating a FieldValue from a
FieldDescriptor easier.

```js
const fieldValue = FieldValue.from({ name: 'firstName', value: 'John' }, text);
```

### `serialize()`

- __Returns__ a json object

Uses the serializer provided in construction to serialize itself. The default
serializer will return `{}` if `FieldValue.value` is undefined. The output of
each FieldValues serialize function gets merged in to one object by
[`FilledForm.store`] so returning `{}` ensures this field will not be stored.

### `validate()`

- __Returns__ `true` if validations passed, `false` otherwise

Executes any validations given in construction against itself. Validations are
expected to be `Validator` object.

The first validation to fail will prevent further validations from executing,
allowing a cascade of validations with appropriate messages.

### `get errors()`

- __Returns__ an array of strings

Returns the error messages from any validators that failed.

### `get mappedErrors()`

- __Returns__ an array of objects `{ id: string, message: string }`

Returns the error messages from any validations that failed with the id of the
current FieldValue. This is used by templates to render a summary and link to
the field that caused the error.

### `get valid()`

- __Returns__ `true` if validations have been executed, `false` otherwise

### `get validated()`

- __Returns__ `true` if validations passed, `false` otherwise

### `clone(overrides)`

- __Returns__ an instance of FieldValue

Creates a new instance of FieldValue copying the current instance. Any keys in
`overrides` will override the keys from the current instance.

FieldValues aim to not be mutated as this makes working with values that wrap
other values easier. `clone` provides a way to easily return a new value with
some transformation applied.

[`constructor(args)`]: #constructor-args
[`FieldDescriptor`]: /docs/forms/internal-api/FieldDescriptor
[`FilledForm.store`]: /docs/forms/internal-api/FilledForm#store
