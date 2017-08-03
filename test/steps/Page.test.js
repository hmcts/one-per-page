const Page = require('./../../src/steps/Page');
const {testStep} = require('../util/supertest');
const {expect} = require('../util/chai');
const {NotImplemented} = require('../../src/errors/expectImplemented');

describe('Page', () => {
  {
    const unimplementedPage = () => { new class extends Page {}(); };

    it('expects url to be implemented', () => {
      return expect(unimplementedPage)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('url');
    });
  }

  {
    const page = testStep(new class extends Page {
      get url() { return '/my/page'; }
      get template() { return 'page_views/simplePage'; }
    }());

    it('renders the page on GET', () => {
      return page.get().expect(200, '<h1>Hello, World!</h1>\n');
    });
    it('returns 405 (method not allowed) on POST', () => {
      return page.post().expect(405);
    });
    it('returns 405 (method not allowed) on PUT', () => {
      return page.put().expect(405);
    });
    it('returns 405 (method not allowed) on DELETE', () => {
      return page.delete().expect(405);
    });
    it('returns 405 (method not allowed) on PATCH', () => {
      return page.patch().expect(405);
    });
  }

  it('has access to the session', () => {
    const page = new class extends Page {
      get url() { return '/my/page'; }
      get template() { return 'page_views/session'; }
    }();

    return testStep(page)
      .withSession({ foo: 'Foo', bar: 'Bar' })
      .get()
      .expect(200, 'Foo Bar\n');
  });

  it('looks for a template named [Step.name] by default', () => {
    const page = new class extends Page { get url() { return '/page'; } }();
    return testStep(page).get().expect(200, 'Default Page template\n');
  });
});


