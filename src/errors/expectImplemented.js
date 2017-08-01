class NotImplemented extends Error {
  constructor(obj, unimplemented) {
    super();
    this.name = 'NotImplemented';
    this.message = `${obj.constructor.name} must implement ${unimplemented.join(', ')}`;
    this.unimplemented = unimplemented;
  }
}

const expectImplemented = (obj, ...keys) => {
  const prototype = Object.getPrototypeOf(obj);
  const properties = Object.getOwnPropertyNames(prototype);

  const unimplemented = keys.reduce((arr, key) => {
    if (properties.includes(key) || typeof prototype[key] === 'function') {
      return arr;
    }
    return [...arr, key];
  }, []);

  if (unimplemented.length) {
    throw new NotImplemented(obj, unimplemented);
  }
};

module.exports = {
  expectImplemented,
  NotImplemented
};
