class TreeWalker {
  constructor(step) {
    this.step = step;
    this.journey = step.journey;
  }

  iterate(/* block */) { /* intentionally blank */ }

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

class StopHere extends TreeWalker {
  iterate(block, results) {
    return results;
  }
}

const stopHere = step => new StopHere(step);

class IfCompleteThenContinue extends TreeWalker {
  iterate(block, results) {
    this.step.retrieve().validate();
    results.push(block(this.step));
    if (this.step.valid) {
      const next = this.journey.instance(this.step.next().step);
      return next.flowControl;
    }
    return results;
  }
}

const ifCompleteThenContinue = step => new IfCompleteThenContinue(step);

module.exports = { stopHere, ifCompleteThenContinue };
