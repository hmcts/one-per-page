# Interstitial

> Extends [`Page`]

## Usage

_InfoPage.step.js_
```javascript
const { Interstitial } = require('@hmcts/one-per-page/steps');

class InfoPage extends Interstitial {
  next() {
    return goTo(this.journey.steps.Name);
  }
}
```

Interstitials expect a template named the same as the class name.

_InfoPage.template.html_
```
<html>
  <!-- Your template here -->
</html>
```

> Read more on [how templates are located].

-------------------------------------------------------------------------------

## Behaviours

### GET Requests

On GET requests the Interstitial acts like a [`Page`] and renders a template.

### POST Requests

On POST request the Interstitial will redirect the user to the next step as
defined in the `next` function, just as a Question does.

> Read more on [redirecting to the next step].

-------------------------------------------------------------------------------

## API

### `next()`

- __Required__ Interstitials must provide a next step in order to redirect the user.
- __Returns__ a [flow control][flow].

The `next` function is how we describe how Questions string together. Using
the [flow controls defined in the flow package][flow] and the
[Journeys list of steps in this journey][Journey-steps] we describe where to
send the user next:

```javascript
const { goTo } = require('@hmcts/one-per-page/flow');

class AboutYourDivorce extends Interstitial {
  next() {
    return goTo(this.journey.steps.Address);
  }
}
```

[`Page`]: /docs/steps/Page
[`Question`]: /docs/steps/Question
[how templates are located]: /docs/steps/Page#template-resolution
[redirecting to next step]: /docs/steps/Question#redirect-to-next-step
