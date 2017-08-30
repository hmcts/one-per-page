const { Router: expressRouter } = require('express');
const { expectImplemented } = require('../errors/expectImplemented');

const bindStepToReq = step => (req, res, next) => {
  req.currentStep = step;
  step.journey = req.journey;
  next();
};

class BaseStep {
  constructor() {
    expectImplemented(this, 'url', 'handler');
  }

  get middleware() {
    return [];
  }
  get name() {
    return this.constructor.name;
  }
  get router() {
    if (this._router) return this._router;

    this._router = expressRouter();
    this._router.all(this.url, bindStepToReq(this));
    this.middleware.forEach(middleware => {
      this._router.all(this.url, middleware.bind(this));
    });
    this._router.all(this.url, this.handler.bind(this));
    return this._router;
  }
}

module.exports = BaseStep;
