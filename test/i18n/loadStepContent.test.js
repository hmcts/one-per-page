const { expect } = require('../util/chai');
const i18Next = require('i18next');
const loadStepContent = require('../../src/i18n/loadStepContent');
const { contentProxy } = require('../../src/i18n/contentProxy');
const path = require('path');
const { middlewareTest } = require('../util/middlewareTest');

describe('i18n/loadStepContent', () => {
  it('presents an express middleware', () => {
    expect(loadStepContent).to.be.a('function');
    expect(loadStepContent.toString()).to.match(/req,res,next/);
  });

  it('expects req.currentStep to be a step', () => {
    const shouldFail = middlewareTest({ currentStep: {} })
      .use(loadStepContent)
      .run();
    return expect(shouldFail).rejectedWith('req.currentStep is not a Step');
  });

  it('expects req.currentStep to have a content proxy set', () => {
    const currentStep = { dirname: '', name: '' };
    const shouldFail = middlewareTest({ currentStep })
      .use(loadStepContent)
      .run();
    return expect(shouldFail).rejectedWith(/no content proxy/);
  });

  it('expects req.i18Next to be defined', () => {
    const currentStep = {
      dirname: '',
      name: '',
      content: new Proxy({}, contentProxy)
    };
    const shouldFail = middlewareTest({ currentStep })
      .use(loadStepContent)
      .run();
    return expect(shouldFail).rejectedWith(/i18Next not configured/);
  });

  const tests = [
    'content.json',
    'content.en.json',
    'StepName.json',
    'StepName.en.json',
    'StepName.content.json',
    'StepName.content.en.json'
  ];

  const testRoot = path.resolve(__dirname, './fixtures/loadStepContent');
  const i18N = i18Next.init();
  i18N.changeLanguage('en');
  const request = {
    i18Next: i18N,
    currentStep: {
      dirname: testRoot,
      name: 'StepName',
      content: new Proxy(i18N, contentProxy)
    }
  };
  const loadContentTest = middlewareTest(request)
    .use(loadStepContent)
    .run();

  tests.forEach(filename => {
    it(`loads content from ${filename}`, () => {
      const key = filename.replace(/\./g, '_dot_');
      return loadContentTest
        .then(req => expect(req.i18Next.t(key)).to.eql('Expected Value'));
    });
  });

  it('expects [stepname].json to have lang codes as top level keys', () => {
    const currentStep = {
      dirname: path.resolve(__dirname, './fixtures/loadStepContent'),
      name: 'WillThrow',
      content: new Proxy({}, contentProxy)
    };
    const shouldFail = middlewareTest({ currentStep, i18Next: i18N })
      .use(loadStepContent)
      .run();
    return expect(shouldFail).rejectedWith(/not a country code/);
  });
});
