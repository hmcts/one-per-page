const notDefined = val => typeof val === 'undefined' || val === null;
const defined = val => !notDefined(val);
const ensureArray = maybeArray => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
};

module.exports = { notDefined, defined, ensureArray };
