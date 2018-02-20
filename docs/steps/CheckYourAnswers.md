# CheckYourAnswers

> Extends [Question]

The `CheckYourAnswers` step creates a page that displays the answers the
user has entered and asks them to confirm that they are correct. This
step follows the [Check your Answers page pattern] from the Service Manual.

![Example of a CheckYourAnswers step](/docs/images/check-your-answers.png)

## Usage

To create a Check Your Answers step you extend `CheckYourAnswers`:

```js
const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');

class CheckYourAnswers extends CYA {
}
```

And create a template that extends the `check-your-answers.html` template
from [`@hmcts/look-and-feel`]:

```jinja
{% extends "look-and-feel/layouts/check_your_answers.html" %}

{% set title %}
Check your answers
{% endset %}
```

## Behaviour

CheckYourAnswers is a step that collects answers given in previous steps and
allows the user to change the values.

### Defining answers

Each Question provides it's answers via the `answers()` function and the default
implmentation will provide an answer that concatenates the steps fields together.

```javascript
class Name extends Question {
  get form() {
    return form({
      firstName: text,
      lastName: text
    });
  }
}

const name = new Name(req, res);
name.retrieve();
name.answers();
// {
//   question: 'Name',
//   answer: 'John Smith'
//   ...
// }
```

You can customise the answer produced by a Question by overriding the `answers()`
function:

```javascript
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

class Name extends Question {
  ...
  answers() {
    return answer(this, {
      question: 'Your name'
    });
  }
}
```

The `answers()` function can also return an array of answers if your question
should produce more than one answer for CheckYourAnswers.

> See [`answer(step, options)`] for more on what properties of an answer can be
> overridden.

### Sectioning your answers

By default all answers generated will be rendered in a single main block on the
CheckYourAnswers page. On complex services you will want to separate answers in
to different sections, for example to group answers into answers about the
applicant and answers about the application.

![An example of answers sectioned and unsectioned](/docs/images/sections.png)

To section out answers you need to declare the sections you want in your
CheckYourAnswers step:

```javascript
class Confirm extends CheckYourAnswers {
  sections() {
    return [
      section('personal-details', { title: 'Personal Details' }),
      section('respondent-details', { title: 'Respondent Details' }),
    ];
  }
}
```

> See [`sections()`] and [`section(id, options)`] for more on declaring your
> sections.

You then need to identify which answers should be placed in which section. You
do this by adding the section id to the answer in your Questions:

```javascript
class RespondentsName extends Question {
  answers() {
    return answer(this, { section: 'respondent-details' });
  }
}

class YourName extends Question {
  answers() {
    return answer(this, { section: 'personal-details' });
  }
}
```

The `section` given in the answer must match an id of a section declared in your
CheckYourAnswers step, otherwise the answer will be omitted from the page.

If you don't provide a section in your answer then the answer will be placed in
the "Other details" section (as seen in the example above).

## API

### `sections()`

- __Expects__ an array of [`section(id, options)`]

Allows you to declare the sections that should appear on the CheckYourAnswers
step.

```javascript
class Confirm extends CheckYourAnswer {
  sections() {
    return [section('section-id', { title: 'Section Title' })];
  }
}
```

> See [`section(id, options)`] for how to declare your sections

A default "Other Details" section will always be present to capture any answers
that haven't declared a section id.

### `section(id, options)`

The section function is used to declare a section in the CheckYourAnswers
[`sections()`] function.

#### Usage

```javascript
const { section } = require('@hmcts/one-per-page/checkYourAnswers');

class Confirm extends CheckYourAnswers {
  sections() {
    return [section('section-id', { title: 'Section Title' })];
  }
}
```

The `id` should be a string value that will be used to filter answers in to the
correct section.

> See [`answer(step, options)`] for more on declaring which section an answer
> should be rendered in.

#### Options

- `title` - string, required

  The text to render on the page as the title of the section. Can be pulled from
  i18n content using `this.content.[key]`.

### `answer(step, options)`

The answer function allows steps to define the answers they produce.

#### Usage

```javascript
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');

class MyStep extends Question {
  answers() {
    return answer(this, { ... });
  }
}
```

#### Options

- `question` - string, optional

  The text that will be rendered as the question in the answer block. Defaults
  to the steps name.

- `answer` - string, optional

  The text that will be rendered as the answer in the answer block. Defaults to
  the fields declared on the question concantentated with spaces between.

  ```javascript
  class MyStep extends Question {
    answers() {
      return answer(this, {
        question: 'My Question',
        answer: 'My Answer'
      });
    }
  }
  ```

  ![An answer with the question and answer parts customised](/docs/images/answer-example.png)

  > As with any function on a Question you can access the data defined in that
  > question using `this.fields.[field name].value` and use those values in
  > building your answers.

- `section` - string, optional

  The id of the section you want the answer to appear in. If omitted the answer
  will be rendered in "Other details" if any sections are defined or in the
  default main section if no sections are defined.

  ```javascript
  class MyStep extends Question {
    answers() {
      return answer(this, { section: 'personal-details' });
    }
  }

  class Confirm extends CheckYourAnswers {
    sections() {
      return [
        section('personal-details', { title: 'Personal Details' })
        section('respondent-details', { title: 'Respondent Details' })
      ];
    }
  }
  ```

  > See [Sectioning your answers] for more information

- `id` - string, optional

  An id that will be applied to the rendered HTML. Defaults to the steps name.
  Useful when testing your steps as then you can use the id to address the block
  in your test code.

  ```javascript
  class Country extends Question {
    answers() {
      return answer(this, { id: 'country-you-live-in' });
    }
  }
  ```

  which produces the following html

  ```html
  <div id="country-you-live-in">
    <dt class="cya-question">Country</dt>
    <dd class="cya-answer">England</dd>
    ...
  </div>
  ```

  and can be address in your tests using Zepto.JS:

  ```javascript
  expect($('#country-you-live-in .cya-answer')).to.have.$text('England');
  ```

- `url` - string, optional

  The url that will be used for the "Change" link on CheckYourAnswers. Defaults
  to the path of the step.

- `complete` - boolean, optional

  Whether the step passes it's validation. Used to control whether the user is
  allowed to continue past CheckYourAnswers.

- `hide` - boolean, optional

  Hides the answer from displaying on CheckYourAnswers. Useful for steps that
  ask questions that inform the path through the journey but aren't needed to be
  confirmed by the user.

- `template` - string, optional

  Allows you to name a template that should be rendered for the answer block.
  For complex questions it can be preferrable to render your own custom html for
  the answer than trying to squash it in to the simple answer format.

  ```javascript
  class Country extends Question {
    answers() {
      return answer(this, { template: 'Country.answer.html' });
    }
  }
  ```

[`answer(step, options)`]: #answer-step-options
[`sections()`]: #sections
[`section(id, options)`]: #section-id-options
[Sectioning your answers]: #sectioning-your-answers
[Check your Answers page pattern]: https://www.gov.uk/service-manual/design/check-your-answers-pages
[Question]: /docs/steps/Question
