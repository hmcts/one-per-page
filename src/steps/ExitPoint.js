const Page = require('./Page');
const destroySession = require('../session/destroySession');
const { stopHere } = require('../flow');
const deepEqual = require('deep-equal');

storeStateInUrl = (req, res, next) => {
  if (!deepEqual(req.query, req.currentStep.values())) {
    const params = Object.entries(req.currentStep.values())
      .map(([key, val]) => `${key}=${val}`)
      .join('&');
    res.redirect(`${req.route.path}?${params}`);
  } else {
    next();
  }
};

class ExitPoint extends Page {
  get middleware() {
    if (this.req.session.active()) {
      return [
        this.journey.collectSteps,
        ...super.middleware,
        storeStateInUrl,
        destroySession
      ];
    }
    return [...super.middleware];
  }

  get flowControl() {
    return stopHere(this);
  }

  values() {
    return {};
  }

  get params() {
    return this.req.query;
  }
}

module.exports = ExitPoint;
