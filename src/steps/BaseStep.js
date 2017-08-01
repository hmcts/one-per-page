const {Router} = require('express');
const {expectImplemented} = require('../errors/expectImplemented');

class BaseStep {
  constructor() {
    expectImplemented(this, 'url', 'handler');
  }

  get middleware() { return []; }
  get name () { return this.constructor.name;}
  get router() {
    if (this._router) return this._router;

    this._router = Router();
    this.middleware.forEach((middleware) => {
      this._router.use(this.url, middleware.bind(this));
    });
    this._router.use(this.url, this.handler.bind(this));
    return this._router;
  }
}

module.exports = BaseStep;
