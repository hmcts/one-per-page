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
}

class Redirector {
  constructor(step) {
    this.nextStep = step;
  }

  redirect(req, res) {
    res.redirect(this.nextStep.url);
  }

  if(condition) {
    return new Conditional(this, condition);
  }
}

const goTo = step => new Redirector(step);

module.exports = { goTo, Redirector, Conditional };
