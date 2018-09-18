# One per page

Easily build GOV.UK style one question per page services using express,
nunjucks and webpack.

<img src="/docs/images/hero-screens.png"
  id= "hero"
  onmouseover="changeImage('hero','/docs/images/hero-code.png')"
  onmouseout="changeImage('hero','/docs/images/hero-screens.png')" />

## Features

One per page solves a number of hard problems in building a one question per
page service:

- Capturing and validating users answers
- Navigating branching journeys
- Session management
- Content internationalisation
- Template management

All documentation is available at https://one-per-page.herokuapp.com

## Usage

Add one-per-page and look-and-feel to your package.json:

```bash
> yarn add @hmcts/one-per-page @hmcts/look-and-feel
```

Then create a few steps and wire them to your express app:

_app.js_
```js
const app = express();

class Start extends EntryPoint {
  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

class Name extends Question {
  get form() {
    return form({
      firstName: text.joi('Enter your first name', Joi.string().required()),
      lastName: text.joi('Enter your last name', Joi.string().required()),
    });
  }
  next() {
    return goTo(this.journey.steps.CheckYourAnswers);
  }
}

journey(app, {
  steps: [
    Start,
    Name,
    CheckYourAnswers
  ]
});

app.listen(3000);
```

And create a template for your step:

_Name.template.html_

```jinja
{% extends "look-and-feel/layouts/question.html" %}
{% from "look-and-feel/components/fields.njk" import textbox %}

{% set title %}What is your name?{% endset %}

{% block fields %}
  {{ textbox(fields.firstName, "First Name") }}
  {{ textbox(fields.lastName, "Last Name") }}
{% endblock %}
```

> [`@hmcts/look-and-feel`] helps with creating templates

Then start your app:

```bash
> node app.js
# listening on port 3000
```

## Contribute

This project is open to accepting contributions. Check out our
[open issues for ideas][issues] on where to start or to raise your own issue.
Read our [development documentation][dev-docs] for help on getting started.

[issues]: https://github.com/hmcts/one-per-page/issues
[dev-docs]: https://one-per-page.herokuapp.com/docs/development
[`@hmcts/look-and-feel`]: https://github.com/hmcts/look-and-feel


<script type="text/javascript">
function changeImage(id, newImage) {
  document.getElementById(id).src = newImage;
}
</script>
