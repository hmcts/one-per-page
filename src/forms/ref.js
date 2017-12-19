const option = require('option');
const { FieldDesriptor } = require('./field');

class Reference extends FieldDesriptor {
  constructor(step, name, parser) {
    super(name, parser);
    this.step = step;
  }

  /**
   * Loads the field from the session
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the parsed field filled with it's value
   */
  parse(key, _, req) {
    this.value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[this.step.name]))
      .flatMap(values => option.fromNullable(values[this.name]))
      .map(content => this.parser.parse(content))
      .valueOrElse(this.parser.nullValue);

    return this;
  }

  /**
   * Deserializes this field from the session
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the loaded field filled with it's value
   */
  deserialize(key, _, req) {
    this.value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[this.step.name]))
      .flatMap(values => option.fromNullable(values[this.name]))
      .valueOrElse(this.parser.nullValue);

    return this;
  }

  /**
   * Will not store the field in the session
   *
   * @return {{ }} - empty object
   */
  serialize() {
    return {};
  }
}

const ref = (...args) => new Reference(...args);

module.exports = { Reference, ref };
