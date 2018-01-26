# Page

> Extends [`BaseStep`][BaseStep]

The page type provides a way of serving templates as part of a transaction.

## Usage

_MyPage.step.js_
```
const { Page } = require('@hmcts/one-per-page/steps');

class MyPage extends Page {}
```

Pages expect a template named the same as the class name of the Page.

_MyPage.template.html_
```
<html>
  <!-- Your template here -->
</html>
```
Read more on [how templates are located](#template-resolution).

-------------------------------------------------------------------------------

## Behaviours

### GET Requests

Pages handle GET requests by rendering the template it has resolved.

### Template Resolution

Pages automatically search for templates to render by looking for files named with
it's class name in the same directory.

- [path to step]/[step name].html
- [path to step]/[step name].template.html
- [path to step]/template.html

> _For example_ for a page named `MyPage` in `app/steps` the following places will
> be tried in order:
>
> - app/steps/MyPage.html
> - app/steps/MyPage.template.html
> - app/steps/template.html

Any correctly named files in any `express.views` folders you may have set will
be used as a fallback if no template is found.

Templates are rendered using a standard express `res.render(template)` call, so
any `view-engine` you configure your app with will be supported.

### Content (i18n) Resolution

Similar to templates, Content files are resolved based on the step name and the
steps location.

Content files are loaded in to [i18next] and [exposed to templates](#template-locals).

Language codes are expected to be a standard [IETF language tag] for example:
`en`, `en-GB`, `it`, `de-DE`.

#### Language specific files

Language specific files are loaded from the following locations:

- [path to step]/[step.name].[language code].json
- [path to step]/[step.name].content.[language code].json
- [path to step]/content.[language code].json

The contents of these files are parse as key/value pairs:

```json
{
  "[key]": "[translation]",
  "[nested]": {
    "[key]": "[nested translation]"
  }
}
```

These keys will be available in templates from `content.key` or
`content.nested.key`.

#### Language bundled files

Language bundled files are loaded from the following locations:

- [path to step]/[step.name].json
- [path to step]/[step.name].content.json
- [path to step]/content.json

The contents of these files are parsed as a language code to an object of
key/value pairs:

```json
{
  "[language code]": {
    "[key]": "[translation]",
    "[nested]": {
      "[key]": "[nested translation]"
    }
  }
}
```

### Template locals

Properties defined on a Page are automatically exposed to the template.

__For example__ with the following Page:

_MyPage.step.js_
```javascript
class MyPage extends Page {
  get someGetter() {
    return 'Accessible in template';
  }

  someFunction(name) {
    return name + ' accessible in template';
  }
}
```

You can access these properties from your template:

_MyPage.template.html_
```nunjucks
{{ someGetter }}
{{ someFunction('Michael') }}
```

-------------------------------------------------------------------------------

## API

The Page type expects you to create a subclass that extends it and implement
the following methods:

### `content`

An i18n proxy that allows access to your loaded content from templates and
functions defined on the Page.

__For example__ with the following content:

```
{
  "name": "What is your name?",
  "errors": {
    "nameMissing": "Enter your name"
  }
}
```
You can access this content from a template:
```
{{ content.name }}
{{ content.errors.nameMissing }}
```
In a function on a Page you can access via `this.content`:
```
class MyPage extends Page {
  someFunction() {
    return this.content.name;
  }
}
```

### `template`

Resolved via the [resolveTemplate] middleware. This property stores the path
to the template to render.

To override this you can define a `template` getter which returns your template
path:

```
class MyPage extends Page {
  get template() {
    return 'path/to/my/template.html';
  }
}
```

[BaseStep]: /docs/steps/BaseStep
[i18Next]: https://www.i18next.com/
[IETF language tag]: https://en.wikipedia.org/wiki/IETF_language_tag
[resolveTemplate]: /docs/middleware/resolveTemplate
