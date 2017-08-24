class Field {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class FieldDesriptor {
  constructor(name) {
    this.name = name;
  }
  parse(req) {
    req.fields[this.name] = new Field(this.name, '');
  }
}

const field = name => new FieldDesriptor(name);

module.exports = { field, FieldDesriptor };
