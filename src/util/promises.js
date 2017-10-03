class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

const fallback = promises => {
  const deferred = new Defer();
  let rejected = 0;
  const handleRejection = next => () => {
    rejected += 1;
    if (rejected === promises.length) {
      deferred.reject(new Error('All promises rejected'));
    }
    return next;
  };
  const chainPromises = (chain, head) => head.catch(handleRejection(chain));
  const terminal = undefined; // eslint-disable-line no-undefined

  promises
    .reverse()
    .reduce(chainPromises, terminal)
    .then(deferred.resolve);

  return deferred.promise;
};

module.exports = { fallback, Defer };
