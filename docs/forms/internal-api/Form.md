# Form

Form provides a way of describing what data you want to collect in your
[`Question`]'s.

## Usage

```js
const { form, text } = require('@hmcts/one-per-page/forms');

class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
}
```

## Behaviour

Forms encapsulate the logic for parsing and validating a users input. They also
provide hooks for serializing and deserializing captured values so they can be
stored in session.

Each [field][field] is responsible for it's own values, the form orchestrates
the parsing and deserializing.

### Parsing a request body

Forms expect a form-encoded request body where each key is the name of a field.
The form will call [`field.parse(key, values, request)`] for each field in it's
definition.

Each field is expected to understand how to pluck their value from the `values`
object using the `key` they have been given. This gives each field a high degree
of autotonomy and allows for fields that [convert their values],
[contain nested fields] or can [load answers given in another step].

### Retrieving stored values from session

Session values are stored in session by step name. [`FilledForm`] is responsible
for storing the values, Form is responsible for retrieving them.

Forms orchestrate the retrieving of session values from session by delegating to
it's fields. Each field is expected to pluck it's value from the session using
the key the form gives it (the field name declared for that field).

> See [`FilledForm`] for more information about how session values are stored

## API

### `form(fields)`

- __Returns__ a Form object
- __Expects__ fields to be an object of `{ name: field type }`

Each key in `fields` is expected to be a [field].

### `Form.parse(request)`

- __Returns__ a [`FilledForm`] object
- __Expects__ `request.body` to be a json object

Parses the request body by calling [`field.parse(key, values, request)`] for each
field declared.

### `Form.retrieve(stepName, request)`

- __Returns__ a [`FilledForm`] object
- __Expects__ `request.session` to be a json object

Retrieves previously stored values from the session by calling each fields
[`field.deserialize(key, values, request)`] function.

[`Question`]: /docs/steps/Question
[field]: /docs/forms/fields
[`FilledForm`]: /docs/forms/internal-api/FilledForm
[`field.parse(key, values, request)`]: /docs/forms/internal-api/FieldDescriptor#parse-key-values-request
[`field.deserialize(key, values, request)`]: /docs/forms/internal-api/FieldDescriptor#deserialize-key-values-request
[convert their values]: /docs/forms/field-types#convert-transformation-field
[contain nested fields]: /docs/forms/field-types#object-name-field-type
[load answers given in another step]: /docs/forms/field-types#ref-step-fieldname
