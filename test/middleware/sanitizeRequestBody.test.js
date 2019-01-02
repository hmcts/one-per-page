
const { expect, sinon } = require('../util/chai');
const sanitizeRequestBody = require('../../src/middleware/sanitizeRequestBody');
const sanitizer = require('sanitizer');

let sanitizerSpy = {};
let req = {};

describe('sanitizeRequestBody', () => {
  beforeEach(() => {
    sanitizerSpy = sinon.spy(sanitizer, 'sanitize');
    req = {};
  });

  afterEach(() => {
    sanitizerSpy.restore();
  });

  it('runs sanitizer on each item in body', done => {
    req.body = {
      foo: 'value1',
      bar: { bar: 'value2', baz: ['array1', 'array2', 'array3'] }
    };

    sanitizeRequestBody(req, {}, () => {
      expect(sanitizerSpy.withArgs('value1')).calledOnce;
      expect(sanitizerSpy.withArgs('value2')).calledOnce;
      expect(sanitizerSpy.withArgs('array1')).calledOnce;
      expect(sanitizerSpy.withArgs('array2')).calledOnce;
      expect(sanitizerSpy.withArgs('array3')).calledOnce;
      done();
    });
  });

  it('strips malicious code from post requests', done => {
    req.body = {
      script1: 'some text',
      script2: 'some text<script>alert(document.cookie);</script>',
      script3: 'some text<script type="text/vbscript">alert(DOCUMENT.COOKIE)</script>', // eslint-disable-line max-len
      script4: 'some text\x3cscript src=http://www.example.com/malicious-code.js\x3e\x3c/script\x3e' // eslint-disable-line max-len
    };

    sanitizeRequestBody(req, {}, () => {
      Object.keys(req.body).forEach(key => {
        expect(req.body[key]).to.eql('some text');
      });
      done();
    });
  });
});