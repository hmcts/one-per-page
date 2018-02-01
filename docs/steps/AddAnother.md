# AddAnother

> Extends [Question]

The `AddAnother` step creates a question that allows a user to enter a list of
items. This is done using HTTP requests so that it works without needing
client-side Javascript.

![Example of the AddAnother step](/docs/images/add-another.png)

## Usage

To create an AddAnother step you extend `AddAnother` and provide a field to
capture.

```js
const { AddAnother } = require('@hmcts/one-per-page/steps');
const { date } = require('@hmcts/one-per-page/forms');

class DatesOfYourAppointments extends AddAnother {
  get field() {
    return date;
  }
}
```

This field can be any single field. If you need to capture more than one
field, use a complex field type such as [`object`].

You also need to create a corresponding template that renders a list of
collected items in list mode and a form to collect an item in edit mode. The
`add_another.html` template from [`@hmcts/look-and-feel`] provides this
functionality.

```jinja
{% extends "look-and-feel/layouts/add_another.html" %}
{% from "look-and-feel/components/fields.njk" import date %}

{% set title %}
{{ "Tell us when you can’t go to a hearing" if isListMode }}
{{ "Enter a date you can’t go to a hearing" if isEditMode }}
{% endset %}

{% block item %}
  {{ item.day.value }}/{{ item.month.value }}/{{ item.year.value }}
{% endblock %}

{% block editItem %}
  {{ date(fields.item, "Date you can't attend") }}
{% endblock %}
```

## Behaviour

AddAnother is a step that presents mutliple "modes", each of which act
differently on GET or POST. Which mode is used depends on the URL accessed.

- `/[path]` - [List mode]
- `/[path]/[index]` - [Edit mode]
- `/[path]/[index]/delete` - [Delete mode](#delete-mode)

where `[path]` is the usual [generated path of a step].

### List mode

On __GET__ requests to `/[path]` the step will render a [list of collected items].
Before rendering the step will [validate the list of items]

On __POST__ requests to `/[path]` the step will [validate the list of items]
and if successful [redirect to the next step].

In templates in list mode you can access the list field that contains the list of
captured items via `{{ fields.items }}`

### Edit mode

On __GET__ requests to `/[path]/[index]` the step will render a form to
[capture an item]. If the `[index]` exists inside the list already the form
will be prepopulated with that items values, allowing a user to edit the item.

On __POST__ requests to `/[path]/[index]` the step will [validate the item] and
then append the item to the list and redirect to [List mode].

In templates in edit mode you can access the current item via `{{ fields.item }}`.

### Delete mode

On __GET__ requests to `/[path]/[index]/delete` the step will remove the item
at `[index]` from the list stored in session and then redirect to [List mode].

### List all items

In [List mode] the step will use the field you defined to [capture an item] to
build a form that can retrieve a list of these items from session.

The template variable `{{ items }}` contains the list field retrieved.
The [`add_another.html` template] will render the list of items for the user to
view, with edit and delete controls to allow them to control which values are
submitted.

You can customise how each item is rendered in the list by defining the
[`item` block] in your template. You can customise how the list itself is rendered
by defining the [`listItems` block] in your template.

### Capture an item

AddAnother expects you to provide a field that you would like to capture.

```js
class DatesYouCanAttend extends AddAnother {
  get field() {
    return date;
  }
}
```

[Edit mode] uses this field definition to build a form that will be used to
capture and validate the users input.

You can make this field as complex as you wish, including adding any validation
you want applied before appending the new item in to the list.

```js
get field() {
  return object({
    dateYouCantAttend: date.required(),
    reason: text.joi(
      "Enter a reason you can't attend",
      Joi.string().required()
    )
  });
}
```

In the example above we capture an object with a date and a reason for not
attending, adding validation that will ensure they are answered.

The template for this field definition would need to define an input for each
sub-field in it's [`editItem` block]:

```jinja
{% extends "look-and-feel/layouts/add_another.html" %}
{% from "look-and-feel/components/fields.njk" import date, text %}

{% block editItem %}
  {{ date(fields.item.dateYouCantAttend, "Date you can't attend") }}
  {{ text(fields.item.reason, "Reason why you can't attend") }}
{% endblock %}
```

### Edit an item

If the `[index]` in the [Edit mode] url exists inside the range of the list of
already captured items then the template will be rendered with that items values
prefilled.

This allows a user to correct any mistakes they may have made.

The same behaviour described in [capture an item] is used when editing an item,
the only change is that the item will not be appended to the list but replace the
old stored value.

### Validate the list of items

Validating each individual value is done when [capturing an item][capture an item]
by defining validations in the [`get field()`] definition.

These validations will also be applied to each item in the list in [List mode].
You may also want to validate the list itself, for example to require that a
minimum number of items have been added to it.

You can validate the list by defining the [`validateList(list)`] function in your
class. AddAnother will call `validateList` during construction of the form in
list mode and pass you the list field type it has built. You can then return
the list field with any added checks or validations attached.

```js
validateList(list) {
  return list.check('Enter atleast 1 date', arr => arr.length > 0);
}
```

In the example above we use `validateList` to require that atleast 1 date has
been entered.


### Accessing the items in values, answers, next

As with other Questions, AddAnother steps produces values and answers that are
used in submitting to APIs and rendering on Check Your Answers.

If you want to customise how the step presents it's answers or route to a
different step based on the answers the user has given you can access the full
list of items inside these functions via this.fields.items:

```js
  answers() {
    return answer(this, {
      question: "Dates for your appointments",
      answer: this.fields.items.value.map(d => d.format('DD/MM/YYYY'))
    });
  }
```

## API

### `get field()`

- __Required__ must be implemented for AddAnother to function
- __Returns__ a [field type] or other [FieldDescriptor]

By defining `get field()` you tell AddAnother what type of data you intend to
collect.

```js
class DatesYouCanAttend extends AddAnother {
  get field() {
    return date;
  }
}
```

You can make this field as complex as you want, with as much validation as desired.
The only restriction is that you must return a single field.

To capture multiple fields, use an [object] instead.

> See [capture an item] for more information on how AddAnother uses this function.

### `validateList(list)`

- __Returns__ a [list field type]

Allows you to attach some validations to the list field built from your
[`get field()`] definition.

These validations will only be executed in [List mode] during POST requests.

### `get form()`

- __Returns__ a form containing either `items` or `item` fields

In [List mode] this function will return a form containing a field `items` which
is a list field that can retrieve the saved items from session.

In [Edit mode] it will return a form containing an `item` field which is built
from your `get field()` definition.

AddAnother will use this function to build `this.fields` as other Questions do.

### `get mode()`

- __Returns__ a string, either `'list'`, `'edit'` or `'delete'`

Returns the current mode by inspecting the current url:

- `/[path]` - `'list'`
- `/[path]/[index]` - `'edit'`
- `/[path]/[index]/delete` - `'delete'`

### `get isListMode()`

- __Returns__ `true` if `get mode()` is `'list'`, otherwise `false`
- __Exposed__ in templates as `{{ isListMode }}`

This getter is useful for only rendering content in your template if you are in
[List mode].

### `get isEditMode()`

- __Returns__ `true` if `get mode()` is `'edit'`, otherwise `false`
- __Exposed__ in templates as `{{ isEditMode }}`

This getter is useful for only rendering content in your template if you are in
[Edit mode].

### `get isDeleteMode()`

- __Returns__ `true` if `get mode()` is `'delete'`, otherwise `false`
- __Exposed__ in templates as `{{ isDeleteMode }}`

This getter is useful for only rendering content in your template if you are in
[Delete mode].

### `get addAnotherUrl()`

- __Returns__ a string, the url that will allow a user to add another item to the list

This getter is used in templates to render a button that the user can click to
switch to edit mode and input a new value.

### `editUrl(index)`

- __Returns__ a string, the url needed to edit the given index

Used by templates to render edit links to allow the user to correct mistakes in
already submitted values.

### `deleteUrl(index)`

- __Returns__ a string, the url needed to delete the given index

Used by templates to render delete links to allow the user to delete an item.

### `get postUrl()`

- __Returns__ a string, the url the form should POST to

If in edit mode this will be the url needed to submit the currently edited item.
If in list mode this will be the url needed to submit the list and continue to the
next step.

### `get index()`

-- __Returns__ a number, the current index or -1 if not in edit mode

Parses the url to return the currently requested index or returns `-1` if not in
edit mode.

### `listModeHandler(request, response)`

Defines the behaviour of AddAnother when listing the collected values.

Called by `handler(request, response)` if in [List mode].

### `editModeHandler(request, response)`

Defines the behaviour of AddAnother when collecting or editing a value.

Called by `handler(request, response)` if in [Edit mode].

### `deleteModeHandler(request, response)`

Defines the behaviour of AddAnother when deleting a value.

Called by `handler(request, response)` if in [Delete mode].

## `add_another.html` template

[`@hmcts/look-and-feel`] provides a template that makes using the AddAnother
step easier.

To use the template import it in your template file:

_myStep.template.html_
```jinja
{% extends "look-and-feel/layouts/add_another.html" %}
```

and import it's stylesheet in your scss entrypoint:

_main.scss_
```scss
@import 'govuk-elements';
@import 'look-and-feel/add-another';
```

### `item` block

The `item` block allows you to customise how each item will be rendered in the
list of items during [List mode].

```jinja
{% block item %}
  {{ item.format('dddd, DD MM YYYY') }}
{% endblock %}
```

![an item formatted by our template example above](/docs/images/an-item.png)

Inside the item block each item in the list is available via the template
local `{{ item }}`.

Each item will be a field of the type you declared in your
[`get field()`] and will have the usual field properties `id`, `name`, `value`,
`errors`.

### `listItems` block

The `listItems` block allows you to customise how the list of items itself is
rendered. If you want to place content above or below the list you can do this
by defining the `listItems` block and calling `{{ super() }}` inside it.

```jinja
{% block listItems %}
  <p>
    It’s important that you make yourself available for a hearing. If you don’t
    show up, your appeal could go ahead in your absence or be delayed by several
    months.
  </p>
  {{ super() }}
{% endblock %}
```

The list of items is available via the template local `{{ fields.items }}`.

### `editItem` block

- __Required__ must be implemented or the template will not fuction in edit mode

The `editItem` block allows you to define the fields that will be used to collect
each item in the list. This needs to be implemented otherwise in edit mode your
step will be unable to capture values.

```jinja
{% block editItem %}
  {{ date(fields.item, "Date you can't attend") }}
{% endblock %}
```

In [Edit mode] the currently captured field is available via `{{ fields.item }}`.

The contents of your `editItem` block will be rendered inside a form configured
to post to your steps edit mode.

![the list of items with content above](/docs/images/list-items-block.png)

[List mode]: #list-mode
[Edit mode]: #edit-mode
[Delete mode]: #delete-mode
[validate the list of items]: #validate-the-list-of-items
[list of collected items]: #list-all-items
[capture an item]: #capture-an-item
[`add_another.html` template]: #add_another-html-template
[`get field()`]: #get-field
[`validateList(list)`]: #validatelist-list
[`editItem` block]: #edititem-block
[`item` block]: #item-block
[`listItems` block]: #listitems-block

[Question]: /docs/steps/Question
[`object`]: /docs/forms/field-types#object-name-field-type
[`@hmcts/look-and-feel`]: https://github.com/hmcts/look-and-feel
[generated path of a step]: /docs/steps/BaseStep#generated-step-url
[redirect to the next step]: /docs/steps/Question#redirect-to-next-step
[field type]: /docs/forms/field-types
[FieldDescriptor]: /docs/forms/internal-api/FieldDescriptor
[object]: /docs/forms/field-types#object-name-field-type
[list field type]: /docs/forms/field-types#list-fieldtype
