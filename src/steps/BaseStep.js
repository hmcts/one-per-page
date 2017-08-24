const { Router: expressRouter } = require('express');
const { expectImplemented } = require('../errors/expectImplemented');

const bindToReq = (_this, property) => (req, res, next) => {
  req[property] = _this;
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
    this._router.use(this.url, bindToReq(this, 'currentStep'));
    this.middleware.forEach(middleware => {
      this._router.use(this.url, middleware.bind(this));
    });
    this._router.use(this.url, this.handler.bind(this));
    return this._router;
  }
}

module.exports = BaseStep;
