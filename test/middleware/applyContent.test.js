const { expect, sinon } = require('../util/chai');
const applyContent = require('../../src/middleware/applyContent');

describe('middleware/applyContent', () => {
  it('sets current steps content to res.locals', () => {
    const content = { title: 'some title' };
    const req = { currentStep: { content: content } };
    const res = {};
    const next = sinon.stub();
    applyContent(req, res, next);
    expect(res.locals.content).to.eql(content);
  });
});