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
    let iterWalker = treeWalker;
    const visits = new Set();
    while (iterWalker instanceof TreeWalker) {
      iterWalker = iterWalker.iterate(step => {
        if (visits.has(step)) {
          throw new Error('possible infinite loop detected');
        }
        visits.add(step);

        return block(step);
      }, results);
    }
    return results;
  }
}

/**
 * Stops walking the tree and returns the results.
 **/
const stopHere = step => new TreeWalker(step, (block, results) => results);

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
  new TreeWalker(step, (/* block, results */) => {
    const next = step.journey.instance(step.next().step);
    return next.flowControl;
  });

module.exports = { stopHere, ifCompleteThenContinue, continueToNext };
