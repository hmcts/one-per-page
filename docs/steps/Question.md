# Question

> Extends [`Page`][Page]

The Question class is used to define a step that asks the user a question
and then redirects them to the next question after they answer.

Chaining questions together is how we build up a one-question-at-a-time
transaction.

## Usage

Define the step:

__Name.step.js__
```javascript
const { Question } = require('@hmcts/one-per-page/steps');

class Name extends Question {
  get form() { /* define your form */ }

  next() { /* declare which step to go to next */ }
}
```

Define it's template:

__Name.template.html__
```nunjucks
{% extends "look-and-feel/layouts/question.html" %}

<!-- Your html/components here -->
```

-------------------------------------------------------------------------------

## Behaviour

### GET requests

On a GET request the Question acts as a [Page] and renders it's template. It will
also [retrieve any answers][behaviour-form] the user may have already entered
so that they can be rendered on the page.

### POST requests

On a POST request the Question will [validate the users input][behaviour-validation]
and if the validation fails [render any errors to the user][behaviour-errors].
If the validation passes then it will [redirect the user to the next step][behaviour-next].

### Parse, store and retrieve users answers

Questions provide a way to declare what answers you want to capture in this Step.
You do this by implementing [`get form()`] on your Question using
the [forms] package.

```javascript
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

In the example above we declare a form that captures two fields, firstName and
lastName, which will be treated as strings.

> Read [field types] for more information about field types.

While handling a POST request the Question will use your form to parse the
url-encoded data sent by the [inputs you declare in the template][behaviour-binding].

### Binding fields to inputs in templates

Questions expect a users answers to be sent on a POST request as url-encoded form
data. To send this data correctly you need to wire together a form in the template.

To make it easier to bind the form to the correct values for each field we expose
the [`fields`] template local:

```html
<form method="POST" action="{{ path }}">
  <label for="{{ fields.firstName.id }}">First Name</label>
  <input name="{{ fields.firstName.name }}"
         id="{{ fields.firstName.id }}"
         value="{{ fields.firstName.value }}">
  ...
</form>
```

The [look-and-feel] package exposes helpers that makes this wiring together easier:

```jinja
{% extends "look-and-feel/layouts/question.html" %}
{% from "look-and-feel/components/fields.njk" import textbox %}

{% set title %}What is your name?{% endset %}

{% block fields %}
  {{ textbox(fields.firstName, "First Name") }}
  {{ textbox(fields.lastName, "Last Name") }}
{% endblock %}
```

### Validate users answers

The [forms] package provides a number of ways to [validate fields]. These are
implemented on your form and are executed on POST requests.

```javascript
const required = value => typeof value !== 'undefined';

class Name extends Question {
  get form() {
    return form({
      firstName: text.check('Enter your first name', required),
      lastName: text.check('Enter your first name', required)
    });
  }
}
```

In the example above we use the `field.check(message, predicate)` function to
require that the user has entered an answer in these fields.

If the validations fail they will be [rendered to the user][behaviour-errors].

### Redirect to next step

If validation passes the user will be redirected to the next step. To declare
which step to send the user to you need to implement [`next()`] on your
Question using the [flow] package.

```javascript
const { goTo } = require('@hmcts/one-per-page/flow');

class Name extends Question {
  next() {
    return goTo(this.journey.steps.Address);
  }
}
```

All steps in the current journey are available via `this.journey.steps` so in
the example above we use `goTo` from [flow] to redirect the user to the
Address step.

> It's important to wire your Questions together using the next function rather
> than issuing your own `302 Redirect`'s. One per Page uses the [`next()`]
> functions to build a graph of your journey that is used for other purposes.

### Render errors

When validation fails the user will be shown the page and the errors will be
available to be rendered in the template.

#### Collected field errors

`fields.errors` contains the errors of all fields collected. This is useful for
generating an error summary.

```jinja
{% for error in fields.errors %}
Error: {{ error.message }}
Id of input: {{ error.id }}
{% endfor %}
```

The `question.html` layout from [look-and-feel] will render an error summary
for you. Usually you should not need to interact with this.

#### Per field errors

Each field has an `errors` property which contains the error messages for that
field. This can be used for rendering errors alongside a field.

```jinja
<label for="{{ field.id }}">First Name</label>
{% for error in field.errors %}
  <span class="error">{{ error }}</span>
{% endfor %}
<input name="{{ fields.firstName.name }}"
       id="{{ fields.firstName.id }}"
       value="{{ fields.firstName.value }}">
```

-------------------------------------------------------------------------------

## API

### `get form()`

- __Required__ Questions must implement a form in order to capture users input.
- __Returns__ an instance of [`form`].

The `form` function is how we define which answers we expect to capture on this
Question. Using the form and fields provided by the [forms] package we build a
form that will be used to [parse the users input][behaviour-form] and
[validate their answers][behaviour-validate]

```javascript
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

The question will use this function to build the [`this.fields`][`fields`]
property.

> See [forms] for more information.

### `next()`

- __Required__ Questions must provide a next step in order to redirect the user.
- __Returns__ a [flow control][flow].

The `next` function is how we describe how Questions string together. Using
the [flow controls defined in the flow package][flow] and the
[Journeys list of steps in this journey][Journey-steps] we describe where to
send the user next:

```javascript
const { goTo, branch } = require('@hmcts/one-per-page/flow');

class IsBritishCitizen extends Question {
  next() {
    const isNotCitizen = this.fields.citizenCheck.value === false;

    return branch(
      goTo(this.journey.steps.Exit).if(isNotCitizen),
      goTo(this.journey.steps.Address)
    );
  }
}
```

In the example above our Question will redirect the user to an exit if they have
answered that they are not a British citizen.

> See the [flow] package for more information.

### `fields`

- __Exposed__ in templates via `{{ fields }}` and in steps via `this.fields`.

An instance of [`FilledForm`] that contains the fields you declared in your
[`get form()`] definition. It is used in [binding fields to inputs in templates][behaviour-binding].

> See [`FilledForm`] for more information.

The `fields` object contains a [`FieldValue`] for each field declared in your
form. For example:

```javascript
class Name extends Question {
  get form() {
    return form({ name: text });
  }
}
```

The form declared above will create a fields object with the filled field `name`
available at `fields.name`:

```jinja
{{ fields.name.value }} {# The value stored in the name field #}
{{ fields.name.id }} {# The id of the name field #}
```

> See [`FieldValue`] for more information.

### `answers()`

- __Returns__ an [`answer`] or an array of [`answer`]s.

Defines the answers that this Question produces, which are rendered on the
Check your Answers screen.

By default, `answers()` will return a single [`answer`] object that will render
a the Question name as the question and any fields concatenated as the answer.

Overriding `answers()` allows you to customise how the questions answer will be
rendered on Check your Answers:

```javascript
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

class Name extends Question {
  ...
  answers() {
    return answer(this, {
      question: 'Your name',
      section: 'personal-details'
    });
  }
}
```

In the example above we are overriding the question to be rendered and marking
the answer to be rendered in the "personal details" section:

![The rendered name answer on Check your Answers](/docs/images/name-answer-example.png)

> See [`answer`] for more information on customising the answers produced by a
> question.


### `values()`

- __Returns__ a json object containing the values captured by this Question

Defines the values that the fields declared in this step produce. These values
are [collected][Journey-collect] and can be used to submit the users answers to
an API.

> See [Journey][Journey-collect] for more on how `values` works.

By default `values()` returns a JSON object with each fields name and value
present.

```javascript
class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
}
> new Name(req, res, journey).retrieve().values()
{ firstName: "Michael", lastName: "Allen" }
```

You can override the returned values by reimplementing `values()` on your Question:

```
class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
  values() {
    return {
      petitioner: {
        firstName: this.fields.firstName.value,
        lastName: this.fields.lastName.value
      }
    };
  }
}
```

When collecting the values all steps the user has answered will be merged, so in
the example above we are putting this steps values in to a `petitioner` object.

### `get flowControl()`

Defines the [TreeWalker] that will be used when directing the user to the next
step.

Overriding this can allow you to control the strategy used when trying to
determine which step to redirect to next. Usually you should not need to change
this.

### `retrieve()`

Creates the [`fields`] property by retrieving answers store in session using the
defined [`form`].

### `parse()`

Creates the [`fields`] property by parsing the users input using the defined
[`form`].

### `store()`

Stores the values captured by the defined [`form`] in the session. Will throw
if [`parse()`](#parse) or [`retrieve()`](#validate) has not been called first.

### `validate()`

Executes the validations declared on the questions [`form`]. Will throw if
[`parse()`](#parse) or [`retrieve()`](#validate) has not been called first.

[behaviour-form]: #parse-store-and-retrieve-users-answers
[behaviour-validation]: #validate-users-answers
[behaviour-next]: #redirect-to-next-step
[behaviour-binding]: #binding-fields-to-inputs-in-templates
[behaviour-errors]: #render-errors
[Page]: /docs/steps/Page
[forms]: /docs/forms
[`FilledForm`]: /docs/forms/internal-api/FilledForm
[`form`]: /docs/forms/internal-api/Form
[`FieldValue`]: /docs/forms/internal-api/FieldValue
[flow]: /docs/flow
[validate fields]: /docs/forms/validation
[field types]: /docs/forms/field-types
[`get form()`]: #get-form
[`fields`]: #fields
[`next()`]: #next
[look-and-feel]: https://github.com/hmcts/look-and-feel/
[Journey-steps]: /docs/flow/RequestBoundJourney#steps
[Journey-collect]: /docs/flow/RequestBoundJourney#collect-steps
[TreeWalker]: /docs/flow/TreeWalker
[Check your Answers]: /docs/steps/CheckYourAnswers
[`answer`]: /docs/steps/CheckYourAnswers#answer
