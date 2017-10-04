const notDefined = val => typeof val === 'undefined' || val === null;
const defined = val => !notDefined(val);

module.exports = { notDefined, defined };
