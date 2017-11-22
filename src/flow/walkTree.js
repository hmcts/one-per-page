const Question = require('../steps/Question');
const Stop = require('./stop');

const walkTree = (start, journey) => {
  let current = start;
  let iterations = 0;
  const results = [];
  const numberOfSteps = Object.keys(journey.steps).length;
  while (iterations <= numberOfSteps) {
    if (current instanceof Question) {
      results.push(current);
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
    const nextStep = current.next().step;
    current = journey.instance(nextStep);

    iterations += 1;
  }
  throw new Error('possible infinite loop encountered');
};

module.exports = walkTree;
