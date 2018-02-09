const { expect } = require('../../util/chai');
const { answer } = require('../../../src/steps/check-your-answers/answer');
const { section } = require('../../../src/steps/check-your-answers/section');
const { textField } = require('../../../src/forms');

describe('steps/check-your-answers/answer', () => {
  const firstName = textField('firstName');
  const lastName = textField('lastName');
  const ref = textField.ref('aRef');
  firstName.value = 'John';
  lastName.value = 'Smith';
  ref.value = 'ShouldNotBeOutput';

  const fields = { firstName, lastName, ref };
  const fakeStep = { name: 'AboutYou', path: '/name', fields };

  it('returns an object', () => {
    const a = answer(fakeStep, {});
    expect(a).to.be.an('object');
  });

  describe('.section', () => {
    it('can be explicitly set', () => {
      expect(answer(fakeStep, { section: 'foo' }).section).to.eql('foo');
    });

    it('defaults to the default section id', () => {
      expect(answer(fakeStep, {}).section).to.eql(section.default.id);
    });
  });

  describe('.question', () => {
    it('can be set explicitly', () => {
      const question = answer(fakeStep, { question: 'Your details' }).question;
      expect(question).to.eql('Your details');
    });

    it('falls back to class name', () => {
      const question = answer({ name: 'Name', fields }).question;
      expect(question).to.eql('Name');
    });

    it('titleises class names', () => {
      const question = answer({ name: 'AboutTheMarriage', fields }).question;
      expect(question).to.eql('About the marriage');
    });
  });

  describe('.answer', () => {
    it('can be set explicitly', () => {
      const _answer = answer(fakeStep, { answer: 'An answer' }).answer;
      expect(_answer).to.eql('An answer');
    });

    it('falls back to step.fields concated (ignoring refs)', () => {
      const _answer = answer(fakeStep, {}).answer;
      expect(_answer).to.eql('John Smith');
    });
  });

  describe('.url', () => {
    it('can be set explicitly', () => {
      const url = answer(fakeStep, { url: '/foo/bar' }).url;
      expect(url).to.eql('/foo/bar');
    });

    it('falls back to step.path', () => {
      const url = answer(fakeStep).url;
      expect(url).to.eql('/name');
    });
  });

  describe('.complete', () => {
    it('is false if step.fields.valid not defined', () => {
      const complete = answer({ name: 'Name', fields: {} }).complete;
      expect(complete).to.be.false;
    });

    it('is false if step.fields.valid is false', () => {
      const complete = answer({ fields: { valid: false } }).complete;
      expect(complete).to.be.false;
    });

    it('is true if step.fields.valid is true', () => {
      const complete = answer({ fields: { valid: true } }).complete;
      expect(complete).to.be.true;
    });
  });
});
