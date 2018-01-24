const Page = require('./Page');
const destroySession = require('../session/destroySession');
const { stopHere } = require('../flow');

storeState = (req, res, next) => {
  if(req.url == req.route.path) {
    req.query = req.currentStep.values();
    req.params["Hey"] = "there";
    req.url = '/done?something=askldnas';
    res.req.params["Hey"] = "there";
    res.req.url = '/done?something=askldnas';
	  
	  res.redirect('/done?something=askldnas');
  // } else {
  } else {
	  next();
  }
  
};

class ExitPoint extends Page {
  get middleware() {
    return [this.journey.collectSteps, ...super.middleware, storeState, destroySession];
  }

  get flowControl() {
    return stopHere(this);
  }
  //
  // values() {
  //   console.log("parent");
  // }
}

module.exports = ExitPoint;
