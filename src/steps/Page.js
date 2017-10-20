const BaseStep = require('./BaseStep');
const addLocals = require('../middleware/addLocals');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const loadStepContent = require('../i18n/loadStepContent');
const resolveTemplate = require('../middleware/resolveTemplate');
const { i18NextInstance } = require('../i18n/i18Next');
const { contentProxy } = require('../i18n/contentProxy');
const { defined } = require('../util/checks');

const notLocals = [
  '_router',
  'journey',
  'constructor',
  'form',
  'next',
  'locals',
  'middleware',
  'handler',
  'req',
  'res'
];

class Page extends BaseStep {
  constructor() {
    super();
    this.content = new Proxy(i18NextInstance, contentProxy(this));
  }

  get middleware() {
    return [resolveTemplate, addLocals, loadStepContent];
  }

  get locals() {
    const proto = Object.getPrototypeOf(this);
    const myDescriptors = Object.getOwnPropertyDescriptors(this);
    const protoDescriptors = Object.getOwnPropertyDescriptors(proto);

    const myKeys = [
      ...Object.keys(myDescriptors).map(key => {
        return { key, descriptor: myDescriptors[key] };
      }),
      ...Object.keys(protoDescriptors).map(key => {
        return { key, descriptor: protoDescriptors[key] };
      })
    ];

    const classLocals = myKeys
      .filter(({ key }) => !(notLocals.includes(key)))
      .reduce((obj, { key, descriptor }) => {
        if (typeof descriptor.value === 'function') {
          obj[key] = descriptor.value.bind(this);
        } else if (defined(descriptor.value)) {
          obj[key] = this[key];
        } else if (defined(descriptor.get)) {
          const step = this;
          Object.assign(obj, {
            get [key]() {
              return descriptor.get.call(step);
            }
          });
        }

        return obj;
      }, {});

    return Object.assign({}, classLocals, this.res.locals);
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template, this.locals);
    } else {
      res.sendStatus(METHOD_NOT_ALLOWED);
    }
  }
}

module.exports = Page;
