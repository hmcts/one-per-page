const Question = require('../steps/Question');
const Stop = require('./stop');

const walkTree = (start, steps) => {
  let current = start;
  let iterations = 0;
  const results = [];
  const numberOfSteps = Object.keys(steps).length;
  while (iterations <= numberOfSteps) {
    results.push(current);

    if (current instanceof Question) {
      current.retrieve().validate();

      if (!current.valid) {
        return results;
      }
    }
    if (typeof current.next === 'undefined') {
      return results;
    }
    if (current.next() instanceof Stop) {
      return results;
    }
    const next = current.next().step.name;
    current = steps[next];

    iterations += 1;
  }
  throw new Error('possible infinite loop encountered');
};

module.exports = walkTree;
