const { Router: expressRouter } = require('express');
const { expectImplemented } = require('../errors/expectImplemented');
const callsites = require('callsites');
const path = require('path');
const slug = require('slug');
const { defined, notDefined } = require('../util/checks');
const logging = require('@log4js-node/log4js-api');
const { timeout } = require('../util/promises');
const errorIfNotReady = require('../middleware/errorIfNotReady');

const bindStepToReq = step => (req, res, next) => {
  req.currentStep = step;
  step.journey = req.journey;
  step.req = req;
  step.res = res;
  next();
};

const MAX_WAIT_MS = 50;

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
    expectImplemented(this, 'handler');
    if (notDefined(this.dirname)) {
      this.dirname = findChildClassFilePath(this);
    }

    this.promises = [];
  }

  waitFor(promise) {
    this.promises.push(promise);
  }

  ready() {
    return timeout(MAX_WAIT_MS, Promise.all(this.promises));
  }

  static get path() {
    const logger = logging.getLogger(this.name);
    if (defined(this.prototype.url)) {
      logger.warn('Deprecated: define static #path instead of #url');
      return this.prototype.url;
    }
    const pathSlug = slug(
      this.name.replace(/([A-Z])/g, ' $1'),
      { lower: true }
    );
    return `/${pathSlug}`;
  }

  // allow step to access it's path
  get path() {
    return this.constructor.path;
  }

  get middleware() {
    return [errorIfNotReady(this)];
  }
  get name() {
    return this.constructor.name;
  }
  get router() {
    if (this._router) return this._router;

    this._router = expressRouter();
    this._router.all(this.path, bindStepToReq(this));
    this.middleware.forEach(middleware => {
      this._router.all(this.path, middleware.bind(this));
    });
    this._router.all(this.path, this.handler.bind(this));
    return this._router;
  }
}

module.exports = BaseStep;
