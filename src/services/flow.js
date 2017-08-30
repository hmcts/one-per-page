class Redirector {
  constructor(step) {
    this.nextStep = step;
  }

  redirect(req, res) {
    res.redirect(this.nextStep.url);
  }
}

const goTo = step => new Redirector(step);

module.exports = { goTo, Redirector };
