# Forms

The forms package provide a way of handling user input, validating the given
data and storing it in session.

## Building a form

In [Questions] you use the `@hmcts/one-per-page/forms` module to declare what
data you are capturing. This gives the Question what it needs to be able to
parse that data from a post request, store it in the session and retrieve it.

```js
const { form, text, bool, date } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page/steps');

class AboutYou extends Question {
  get form() {
    return form({
      name: text,
      dateOfBirth: date,
      contactMe: bool.default(false)
    });
  }
}
```

In the example above we set up a form that will capture a users name, their
date of birth and whether they want to be contacted for feedback.

> Read [Form] for detail on how a Question uses the form you create.

To send this information to the step we need to build a corresponding template
that will post the users data to the step.

```jinja
{% extends "look-and-feel/layouts/question.html" %}
{% from "look-and-feel/components/fields.njk" import textbox, date, selectionButtons %}

{% set title %}
About you
{% endset %}

{% block fields %}
  {{ textbox(fields.name, "Your name") }}

  {{ date(fields.dateOfBirth, "Your date of birth") }}

  {{ selectionButtons(fields.contactMe, "Can we contact you for feedback on this service?",
    inline = true,
    options = [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' }
    ]
  ) }}
{% endblock %}
```

In the template above we are using [`@hmcts/look-and-feel`] to provide template
components. Each field in our form is available in the template via `{{ field.[name] }}`.

> Read [field types] for information on what field types are available.

## Validating user input

The [FieldDescriptor], which the built-in field types are based off, provides a
few ways to run assertions against the users input. This allows you to test that
the users answers are acceptable and render an error message if not.

```js
form({
  name: text
    .joi('Enter a name', Joi.string().required()),
  dateOfBirth: date
    .check('Enter a date in the past', dob => isBeforeNow(dob))
})
```

### Joi validation

In the example above we use the `joi(error, validator)` method to attach a Joi
validator to the field. If the validator fails the error message will be
rendered to the user.

### Simple predicate validation

In the example above we use the `check(error, predicate)` method to attach a
validation rule that will run a predicate against the fields value. If the
predicate fails then the error will be rendered to the user.

### Targeting a nested field

For complex fields, for example nested objects, you may need to validate using
the whole object but want an error attached to a nested field.

We use the `errorFor(target, errorMessage)` function to target our error to one
of the nested fields in the object.

```js
const { form, bool, text, errorFor } = require('@hmcts/one-per-page/forms');

form({
  contact: object({
    contactMe: bool.default(false),
    method: text
  }).check(
    errorFor('method', 'Choose a contact method'),
    ({ contactMe, method }) => {
      if (contactMe) {
        return ['phone', 'email', 'post'].includes(method);
      }
      return true;
    }
  )
})
```

In the example above, if the user has selected `yes` in the `contactMe` field
then we need them to choose a contact method. If they haven't selected a method
then the error will be rendered on the method field.

[Questions]: /docs/steps/Question
[field types]: /docs/forms/field-types
[Form]: /docs/forms/internal-api/Form
[`@hmcts/look-and-feel`]: https://github.com/hmcts/look-and-feel
