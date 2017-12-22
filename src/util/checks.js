const notDefined = val => typeof val === 'undefined' || val === null;
const defined = val => !notDefined(val);
const ensureArray = maybeArray => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
};

const hasKey = (obj, key) => Object.getOwnPropertyNames(obj).includes(key);

const hasKeys = (obj, ...keys) => keys.reduce(
  (result, key) => result && hasKey(obj, key),
  true
);

const isObject = maybeObj =>
  typeof maybeObj === 'object' && !Array.isArray(maybeObj);

// Object.keys(new Date()) === 0 so need the constructor check
const isEmptyObject = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

module.exports = {
  notDefined, defined,
  ensureArray,
  hasKey, hasKeys,
  isObject, isEmptyObject
};
