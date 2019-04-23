# Field types

These basic field types are used to marshal the users inputs in different ways.
They are implemented as instances of [`FieldDescriptor`].

## `text`

> `const { text } = require('@hmcts/one-per-page/forms');`

Text fields parse values from requests as strings. If the key is not present then
the value of your field will be `undefined`. Values are stored in session as
strings.

```js
form({
  firstName: text,
  lastName: text
});
```

### `text.ref(step, fieldName)`

Loads a text field from another step.

> See [`ref(step, field, fieldName)`] for more information.

```js
form({
  appType: text.ref(this.journey.steps.ApplicationType, 'applicationType')
});
```

## `nonEmptyText`

> `const { nonEmptyText } = require('@hmcts/one-per-page/forms');`

NonEmptyText fields are fields that will parse a missing key to an empty string
`""` instead of Text fields `undefined`.

```js
form({
  firstName: nonEmptyText,
  lastName: nonEmptyText
});
```

### `nonEmptyText.ref(step, fieldName)`

Loads a nonEmptyText field from another step.

> See [`ref(step, field, fieldName)`] for more information.

```js
form({
  appType: nonEmptyText.ref(this.journey.steps.ApplicationType, 'applicationType')
});
```

This will load `applicationType` from the `ApplicationType` step and will be
available to you on `this.fields.appType`.

## `bool`

> `const { bool } = require('@hmcts/one-per-page/forms');`

Bool fields parse values to javascript booleans. They will be `undefined` if the
key is missing from the given values.

Truthy values are `'yes'`, `'y'`, `'true'`, `'t'` and `'1'`.

Falsey values are `'no'`, `'n'`, `'false'`, `'f'` and `'0'`.

Values are converted to lowercase strings before comparison so `YeS` and `nO` will
both still be parsed correctly.

```js
form({
  contactMe: bool
});
```

### `bool.default(defaultValue)`

Produces a bool field that will use the given `defaultValue` if the key was missing
from the request body.

```js
form({
  contactMe: bool.default(false)
});
```

### `bool.ref(step, fieldName)`

Loads a bool field from another step.

> See [`ref(step, field, fieldName)`] for more information.

```js
form({
  contact: bool.ref(this.journey.steps.ContactPreference, 'contactMe')
});
```

## `ref(step, field, fieldName)`

> `const { ref } = require('@hmcts/one-per-page/forms');`

Ref fields are used to refer to a value captured in another step.

On parsing a request the Ref fields will instead load the requested value from
session. On storing the Ref will not serialize, ensuring a read-only copy of the
requested data.

```js
form({
  isCitizen: ref(this.journey.steps.CitizenCheck, 'isCitizen')
});
```

## `list(fieldType)`

> `const { list } = require('@hmcts/one-per-page/forms');`

Wraps a given `fieldType` and uses it to parse a list of that type from the
request body to an array. It will store and retrieve it's value in session as an array.

Validations applied to a list will validate the entire array. You can still apply
validations to the wrapped field type.

```js
form({
  names: list(text)
})
```

### `list.ref(step, fieldName, fieldType)`

Loads a list field from another step.

> See [`ref(step, field, fieldName)`] for more information.

```js
form({
  names: list.ref(this.journey.steps.NameStep, 'names', text)
});
```

## `object({ [name]: [field type] })`

> `const { object } = require('@hmcts/one-per-page/forms')`

Object fields wrap a number of other fields, allowing fields to be nested and
grouped.

```js
form({
  petitioner: object({
    firstName: text,
    lastName: text
  }),
  respondent: object({
    firstName: text,
    lastName: text
  })
});
```

In the example above the nested fields can be accessed by their names from the
produced FieldValue, for example `this.fields.petitioner.firstName`.

Objects expect the values in a request body to have the key `[object name].[field name]`:

```js
const req = {
  body: { 'nested.field': 'foo' }
};
const myForm = form({
  nested: object({ field: text })
});
const filled = myForm.parse(req);

filled.nested.value
// { field: 'foo' }

filled.nested.field.value
// 'foo'

```

### `object.ref(step, fieldName, { [field name]: [field type] })`

Loads a object field from another step.

> See [`ref(step, field, fieldName)`] for more information.

```js
form({
  petitioner: object.ref(this.journey.steps.PetitionerDetails, 'peitioner', {
    firstName: text,
    lastName: text
  })
});
```

## `convert(transformation, field)`

> `const { object } = require('@hmcts/one-per-page/forms')`

Wraps a given field and performs the given transformation on it's value. The
transformation is performed on demand and so the original wrapped value is stored
in session, not the transformed value.

The wrapped field is available from `fieldValue.wrapped`.

```js
const req = {
  body: { input: 'i am shouting' }
};
const myForm = form({
  input: convert(value => value.toUpperCase(), text)
});
const filled = myForm.parse(req);

filled.input.value
// I AM SHOUTING

filled.input.wrapped.value
// i am shouting
```

## `date`

> `const { date } = require('@hmcts/one-per-page/forms')`

Defines an object field that captures Day, Month and Year as is produced by
a [GOV.UK Elements date pattern][date-pattern].

Expects values `day`, `month` and `year` to be present in the request body.

```js
const req = {
  body: { day: '1', month: '1', year: '2001' }
};
const myForm = form({
  dob: date
});
const filled = myForm.parse(req);

filled.dob.value
// { day: '1', month: '1', year: '2001' }

filled.dob.day.value
// 1
```

### `date.required(errorMessages)`

Creates a date that validates that the `day`, `month` and `year` field are
required.

The `errorMessages` object is optional and allows you to customise the error
messages:

- `allRequired` - Error message to display if no values are present, defaults to "Enter a valid date"
- `dayRequired` - Error message to display if day is not present, defaults to "Enter a valid day"
- `monthRequired` - Error message to display if month is not present, defaults to "Enter a valid month"
- `yearRequired` - Error message to display if year is not present, defaults to "Enter a valid year"

[`FieldDescriptor`]: /docs/forms/internal-api/FieldDescriptor
[date-pattern]: https://govuk-elements.herokuapp.com/form-elements/example-date/
[`ref(step, field, fieldName)`]: #ref-step-field-fieldname
