const { expect } = require('../util/chai');
const loadStepContent = require('../../src/i18n/loadStepContent');

describe('i18n/loadStepContent', () => {
  it('presents an express middleware', () => {
    expect(loadStepContent).to.be.a('function');
    expect(loadStepContent.toString()).to.match(/req,res,next/);
  });

  it('attaches content proxy to currentStep');
  it('loads content from content.json');
  it('loads content from content.[country].json');
  it('loads content from [StepName].json');
  it('loads content from [StepName].[country].json');
  it('loads content from [StepName].content.json');
  it('loads content from [StepName].content.[country].json');
});
