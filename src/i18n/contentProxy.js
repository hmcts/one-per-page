const i18Next = require('./i18Next');
const util = require('util');
const { notDefined, defined } = require('../util/checks');

const prefixKey = (prefix, key) => {
  if (notDefined(prefix) || prefix === '') {
    return key;
  }
  return `${prefix}.${key}`;
};

const toStringKeys = ['toString', Symbol.toStringTag];
const inspectKeys = ['inspect', util.inspect.custom];

const prefixedGetHandler = prefix => (target, name) => {
  if (toStringKeys.includes(name)) {
    if (target.exists(prefix)) {
      return () => target.t(prefix);
    }
    return () => {
      throw new Error(`No translation for ${prefix}`);
    };
  }
  if (inspectKeys.includes(name)) {
    return () => `Proxy { key: ${prefix}, value: ${target.t(prefix)} }`;
  }
  const key = prefixKey(prefix, name);
  return new Proxy(target, { get: prefixedGetHandler(key) });
};

const proxyHandler = { get: prefixedGetHandler() };

const contentProxy = (req, res, next) => {
  if (defined(req.i18Next)) {
    next();
    return;
  }

  req.i18Next = i18Next;

  next();
};

module.exports = { contentProxy, proxyHandler };
