const notProxiedFuncs = ['validate', 'store'];
const notProxiedGetters = ['errors', 'validated', 'valid'];
const { defined } = require('../util/checks');

const formProxyHandler = {
  get(target, name) {
    if (notProxiedFuncs.includes(name)) {
      return target[name].bind(target);
    }
    if (notProxiedGetters.includes(name)) {
      return target[name];
    }
    const field = target.fields.find(f => f.name === name);
    return field;
  },
  ownKeys(target) {
    return target.fields.map(field => field.name);
  },
  getOwnPropertyDescriptor(target, name) {
    const field = target.fields.find(f => f.name === name);
    if (defined(field)) {
      return {
        configurable: true,
        enumerable: true,
        value: field,
        writable: false
      };
    }
    return undefined; // eslint-disable-line no-undefined
  }
};

module.exports = formProxyHandler;
