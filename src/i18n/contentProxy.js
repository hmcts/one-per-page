const util = require('util');
const { notDefined } = require('../util/checks');

const prefixKey = (prefix, key) => {
  if (notDefined(prefix) || prefix === '') {
    return key;
  }
  return `${prefix}.${key}`;
};

const toStringKeys = ['toString', Symbol.toStringTag];
const inspectKeys = ['inspect', util.inspect.custom];

const contentProxy = (step, prefix) => {
  const get = (target, name) => {
    if (name === 'hasOwnProperty') {
      return property => {
        const isToString = toStringKeys.includes(property);
        const isInspect = inspectKeys.includes(property);
        return isToString || isInspect;
      };
    }
    if (toStringKeys.includes(name)) {
      if (target.exists(prefix)) {
        return () => target.t(prefix, step.locals);
      }
      return () => {
        throw new Error(`No translation for ${prefix}`);
      };
    }
    if (inspectKeys.includes(name)) {
      return () => `Proxy { key: ${prefix}, value: ${target.t(prefix)} }`;
    }
    const key = prefixKey(prefix, name);
    return new Proxy(target, contentProxy(step, key));
  };

  return { get };
};

module.exports = { contentProxy };
