const { FieldDesriptor, makeId } = require('./field');
const option = require('option');

class CheckboxFieldDescriptor extends FieldDesriptor {
  parse(req) {
    const id = makeId(this, req.currentStep);
    const value = option
      .fromNullable(req.body)
      .flatMap(body => option.fromNullable(body[id]))
      .map(content => {
        if (Array.isArray(content)) {
          return content;
        }
        return [content];
      })
      .valueOrElse([]);

    this.id = id;
    this.value = value;
    return value;
  }

  deserialize(req) {
    const id = makeId(this, req.currentStep);

    const value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]))
      .valueOrElse([]);

    this.id = id;
    this.value = value;
    return this;
  }
}

const checkboxField = name => new CheckboxFieldDescriptor(name);

module.exports = { checkboxField, CheckboxFieldDescriptor };
