class ParsedField {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class FieldDesriptor {
  constructor(name) {
    this.name = name;
  }
  parse(/* req */) {
    return new ParsedField(this.name, '');
  }
}

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor, ParsedField };
