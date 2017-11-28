/*
 * TreeWalker
 *
 * A class that encapsulates walking the tree of steps safely.
 *
 * Expects an iterate function that accepts a block and results obj and
 * either returns a TreeWalker to continue walking or the results.
 **/
class TreeWalker {
  constructor(step, iterate) {
    this.step = step;
    this.iterate = iterate;
  }

  map(block) {
    return this.trampoline(this, step => block(step));
  }

  walk() {
    return this.trampoline(this, step => step);
  }

  trampoline(treeWalker, block, results = []) {
    let walkerOrResults = treeWalker;
    const visits = new Set();
    while (walkerOrResults instanceof TreeWalker) {
      walkerOrResults = walkerOrResults.iterate(step => {
        if (visits.has(step)) {
          throw new Error('possible infinite loop detected');
        }
        visits.add(step);

        return block(step);
      }, results);
    }
    return walkerOrResults;
  }
}

/**
 * Validates the step then causes the tree walking to stop.
 **/
const validateThenStopHere = step => new TreeWalker(
  step,
  (block, results) => {
    step.retrieve().validate();
    return [...results, block(step)];
  }
);

/**
 * Stops walking the tree and returns the results.
 **/
const stopHere = step => new TreeWalker(
  step,
  (block, results) => [...results, block(step)]
);

/**
 * Validates the current step and if valid continues down the tree by calling
 * the steps next function.
 **/
const ifCompleteThenContinue = step => new TreeWalker(
  step,
  (block, results) => {
    step.retrieve().validate();
    results.push(block(step));
    if (step.valid) {
      const next = step.journey.instance(step.next().step);
      return next.flowControl;
    }
    return results;
  }
);

const continueToNext = step =>
  new TreeWalker(step, (block, results) => {
    const next = step.journey.instance(step.next().step);
    results.push(block(step));
    return next.flowControl;
  });

module.exports = {
  stopHere,
  validateThenStopHere,
  ifCompleteThenContinue,
  continueToNext
};
