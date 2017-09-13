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