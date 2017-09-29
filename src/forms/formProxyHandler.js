const notProxiedFuncs = ['validate', 'store'];
const notProxiedGetters = ['errors', 'validated', 'valid'];

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
  }
};

module.exports = formProxyHandler;
