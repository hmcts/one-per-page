const textParser = {
  nullValue: undefined, // eslint-disable-line no-undefined
  parse(value) {
    return value.toString();
  }
};

const nonEmptyTextParser = {
  nullValue: '',
  parse(value) {
    return value.toString();
  }
};

const arrayParser = {
  nullValue: [],
  parse(value) {
    return Array.isArray(value) ? value : [value];
  }
};

module.exports = { textParser, arrayParser, nonEmptyTextParser };
