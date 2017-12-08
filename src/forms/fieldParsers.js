const textParser = {
  nullValue: undefined, // eslint-disable-line no-undefined
  parse(value) {
    return value === '' ? this.nullValue : value.toString();
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


const truthy = ['yes', 'y', 'true', 't', '1'];
const falsey = ['no', 'n', 'false', 'f', '0'];

const boolParser = {
  nullValue: undefined, // eslint-disable-line no-undefined
  parse(value) {
    const valueStr = value.toString().toLowerCase();

    if (truthy.includes(valueStr)) {
      return true;
    } else if (falsey.includes(valueStr)) {
      return false;
    }
    return undefined; // eslint-disable-line no-undefined
  }
};

module.exports = {
  textParser,
  arrayParser,
  nonEmptyTextParser,
  boolParser
};
