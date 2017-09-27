const Conditional = require('./conditional');

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

module.exports = Redirector;
