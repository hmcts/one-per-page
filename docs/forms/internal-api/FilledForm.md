# FilledForm

FilledForms are produced by [`form`] when it parses or retrieves session values.
They provide methods to access the parsed values and validate them.

## Usage

In standard use of One per Page you won't often need to create a FilledForm
yourself.

[Questions][Question] will create one for you when handling a request, which you
can access via `question.fields`.

```js
const { form, date } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page/steps');

class DOB extends Question {
  get form() {
    return form({
      dob: date
    });
  }

  get prettyPrintDate() {
    const dob = this.fields.dob;
    return `${dob.day}/${dob.month}/${dob.year}`;
  }
}
```

In the example above `this.fields` is the FilledForm that the Question has built
for us, either by parsing a POST request or loading the values from session.

## Behaviour

### Provide access to field values

FilledForms contain a [`FieldValue`] each field declared in your form, which can
be accessed by using the name given in the form, for example:

```js
const req = {
  body: {
    name: 'John'
  }
};
const myForm = form({ name: text });
const filled = myForm.parse(req);

filled.name.value === 'John'
```

### Validate fields values

FieldValues contain validation rules that were declared on the fields that
produced them. The FilledForm provides a way of executing those validations and
returning whether they succeeded.

You can call [`validate()`] to validate the field values. Once validated you can
access errors through [`get errors()`] or `FilledForm.[field].errors`:

```js
const myForm = form({
  name: text.joi('Provide a name', Joi.string().required())
});
const filled = myForm.parse(req);

filled.errors
// [{ field: name, message: 'Provide a name' }]

filled.name.errors
// ['Provide a name']
```

### Store values in the session

FilledForms orchestrate storing field values in the session. To do this it expects
that each field value understands how to store itself, allowing flexible fields
that can omit themselves if undefined or append themselves to an existing list.

You call [`store(stepName, request)`] to store that forms values in the session.

## API

### `constructor(fieldValues)`

- __Returns__ a FilledForm object
- __Expects__ `fieldValues` to be an object with field names to [`FieldValue`]s

A conveniance function `filledForm` is exposed as a shim over `new FilledForm`.

During construction the FilledForm will bind each property in the `fieldValues`
object to itself, providing access to them directly.

```js
const filled = filledForm({ name: fieldValue('John') })

filled.name.value;
// 'John'
```

### `validate()`

- __Returns__ `true` if validations passed, `false` otherwise

Executes validations on it's fields. [`FieldValue.validate()`] by default will
fail on the first validation that fails to pass but each field will atleast
execute one validation.

### `get validated()`

- __Returns__ `true` if validations have been executed, `false` otherwise

### `get valid()`

- __Returns__ `true` if validations passed, `false` otherwise

### `store(stepName, request)`

- __Mutates__ `request.session`
- __Expects__ `request.session` to be a JSON object

Stores it's fields values in `request.session.[stepName]`. Each field value is
responsible for deserializing itself. Some FieldValues will append their value
to an existing list, some will not deserialize at all.

> See [fields] for specific information about how each field deserializes

### `get errors()`

- __Returns__ an array of error objects, containing a `message` and `id` of the field that produced the error


[`validate()`]: #validate
[`store(stepName, request)`]: #store-stepName-request
[`get errors()`]: #get-errors
[`FieldValue`]: /docs/forms/internal-api/FieldValue
[`FieldValue.validate()`]: /docs/forms/internal-api/FieldValue#validate
[fields]: /docs/forms/field-types
[Question]: /docs/steps/Question
[`form`]: /docs/forms/form
