const formProxyHandler = {
  get(target, name) {
    const field = target.fields.find(f => f.name === name);
    return field;
  }
};

module.exports = formProxyHandler;
