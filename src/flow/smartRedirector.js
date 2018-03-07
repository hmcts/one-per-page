const Redirector = require('./redirector');

class SmartRedirector extends Redirector {
  redirect(req, res) {
    const instance = req.journey.instance(this.nextStep);
    try {
      const nextStep = instance.flowControl.last();
      res.redirect(nextStep.path);
    } catch (error) {
      throw new Error(`${instance.name} does not have a flowControl.`);
    }
  }
}

module.exports = SmartRedirector;
