const { Router: expressRouter } = require('express');
const { expectImplemented } = require('../errors/expectImplemented');
const callsites = require('callsites');
const path = require('path');
const { notDefined } = require('../util/checks');

const bindStepToReq = step => (req, res, next) => {
  req.currentStep = step;
  step.locals = res.locals;
  step.journey = req.journey;
  next();
};

const findChildClassFilePath = step => {
  const callsite = callsites();
  return callsite
    .filter(site => site.getFunctionName() === step.name)
    .map(site => site.getFileName())
    .map(file => path.dirname(file))
    .pop();
};

class BaseStep {
  constructor() {
    expectImplemented(this, 'url', 'handler');
    if (notDefined(this.dirname)) {
      this.dirname = findChildClassFilePath(this);
    }
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
    if (this.afterMiddleware) {
      this.afterMiddleware.forEach(middleware => {
        this._router.all(this.url, middleware.bind(this));
      });
    }
    this._router.all(this.url, this.handler.bind(this));
    return this._router;
  }
}

module.exports = BaseStep;
