const Page = require('./Page');
const destroySession = require('../session/destroySession');
const { stopHere } = require('../flow');
const deepEqual = require('deep-equal');
const querystring = require('querystring');

storeStateInUrl = (req, res, next) => {
  if (!deepEqual(req.query, req.currentStep.values())) {
    const params = querystring.stringify(req.currentStep.values());
    res.redirect(`${req.route.path}?${params}`);
  } else {
    next();
  }
};

class ExitPoint extends Page {
  get middleware() {
    if (this.req.session.active()) {
      return [
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
