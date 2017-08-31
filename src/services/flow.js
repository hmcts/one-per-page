class Conditional {
  constructor(redirector, condition) {
    this.redirector = redirector;
    this.condition = condition;
  }

  redirect(req, res) {
    if (this.condition()) {
      this.redirector.redirect(req, res);
    }
  }

  check() {
    return this.condition();
  }
}

class Redirector {
  constructor(step) {
    if (typeof step === 'undefined') {
      throw new Error('Step given to redirect to is undefined');
    }
    this.nextStep = step;
  }

  redirect(req, res) {
    res.redirect(this.nextStep.url);
  }

  if(condition) {
    return new Conditional(this, condition);
  }
}

class Branch {
  constructor(...redirectors) {
    const branches = Array.from(redirectors);
    const last = branches.pop();
    if (branches.length === 0) { // eslint-disable-line no-magic-numbers
      throw new Error('Branch needs atleast two paths');
    }
    if (!branches.every(b => b instanceof Conditional)) {
      throw new Error('All but the last path must be conditional');
    }
    if (last instanceof Conditional) {
      throw new Error('The last path must not be conditional');
    }
    this.branches = branches;
    this.fallback = last;
  }

  redirect(req, res) {
    const findBranchThatPasses = branches => {
      if (branches.length === 0) { // eslint-disable-line no-magic-numbers
        return this.fallback;
      }
      const [current, ...rest] = branches;
      if (current.check()) {
        return current;
      }
      return findBranchThatPasses(rest);
    };

    findBranchThatPasses(this.branches).redirect(req, res);
  }
}

const goTo = step => new Redirector(step);
const branch = (...redirectors) => new Branch(...redirectors);

module.exports = { goTo, Redirector, Conditional, branch, Branch };
