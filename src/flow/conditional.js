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

module.exports = Conditional;
