const textField = {
  nullValue: undefined, // eslint-disable-line no-undefined
  parse(value) {
    return value;
  }
};

const arrayField = {
  nullValue: [],
  parse(value) {
    return Array.isArray(value) ? value : [value];
  }
};

module.exports = { textField, arrayField };
