const option = require('option');
const { FieldDesriptor, makeId } = require('./field');

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
  parse(req) {
    const id = makeId(this, this.step);

    const value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]))
      .map(content => this.parser.parse(content))
      .valueOrElse(this.parser.nullValue);

    this.id = id;
    this.value = value;
    return this;
  }

  /**
   * Deserializes this field from the session
   *
   * @param {object} req - the express request
   * @return {FieldDescriptor} field - the loaded field filled with it's value
   */
  deserialize(req) {
    const id = makeId(this, this.step);

    const value = option
      .fromNullable(req.session)
      .flatMap(session => option.fromNullable(session[id]))
      .valueOrElse(this.parser.nullValue);

    this.id = id;
    this.value = value;
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
