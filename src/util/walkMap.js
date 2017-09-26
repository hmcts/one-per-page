// This file will soon be removed. To save time, for now, I am ignoring linting.

/* eslint-disable */

/* Walk map loops through each item in array or object returning a
 * to the item. For example an object like:
 * const obj = { foo: { bar: 'bar', bar2: 'bar2'} }
 * walkMap(obj, path => console.log(path))
 * would log out following:
 * 'foo.bar'
 * 'foo.bar2'
 */

const walkArray = (array, callback, path, target = []) => {
  for (const index in array) {
    if (array[index]) {
      target.push(interpret(array[index], callback, target, `${path}[${index}]`));
    }
  }
  return target;
};

const interpret = (value, callback, target, path) => {
  if (Array.isArray(value)) {
    return walkArray(value, callback, path);
  } else if (typeof value === 'object') {
    return walkMap(value, callback, `${path}.`);
  }
  return callback(path, value);
};

const walkMap = (map, callback, path = '', target = {}) => {
  for (const key in map) {
    if (map[key]) {
      target[key] = interpret(map[key], callback, target, `${path}${key}`);
    }
  }
  return target;
};


module.exports = walkMap;
