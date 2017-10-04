const Page = require('./../../src/steps/Page');
const { testStep } = require('../util/supertest');
const { OK, METHOD_NOT_ALLOWED } = require('http-status-codes');
const { expect } = require('../util/chai');
const { NotImplemented } = require('../../src/errors/expectImplemented');

describe('Page', () => {
  {
    const unimplementedPage = () => {
      return new class extends Page {}();
    };

    it('expects url to be implemented', () => {
      return expect(unimplementedPage)
        .to.throw(NotImplemented)
        .that.has.property('unimplemented').which.contains('url');
    });
  }

  {
    const page = testStep(new class extends Page {
      get url() {
        return '/my/page';
      }
      get template() {
        return 'page_views/simplePage';
      }
    }());

    it('renders the page on GET', () => {
      return page.get().expect(OK, '<h1>Hello, World!</h1>\n');
    });

    it('returns 405 (method not allowed) on POST', () => {
      return page.post().expect(METHOD_NOT_ALLOWED);
    });
    it('returns 405 (method not allowed) on PUT', () => {
      return page.put().expect(METHOD_NOT_ALLOWED);
    });
    it('returns 405 (method not allowed) on DELETE', () => {
      return page.delete().expect(METHOD_NOT_ALLOWED);
    });
    it('returns 405 (method not allowed) on PATCH', () => {
      return page.patch().expect(METHOD_NOT_ALLOWED);
    });
  }

  describe('content', () => {
    const content = { title: 'some title' };

    it('creates i18next if i18NextContent exsists', () => {
      const page = new class extends Page {
        get url() {
          return '/my/page';
        }
        get template() {
          return 'page_views/simplePage';
        }
        get i18NextContent() {
          return content;
        }
      }();
      expect(page.i18next).to.not.undefined;
    });

    it('does not create i18next if i18NextContent does not exsists', () => {
      const page = new class extends Page {
        get url() {
          return '/my/page';
        }
        get template() {
          return 'page_views/simplePage';
        }
      }();
      expect(page.i18next).to.be.undefined;
    });

    it('transforms session items in content', () => {
      const contentWithSessionData = {
        en: {
          translation: {
            title: 'some title {{ session.foo }}',
            subTitle: 'some subtitle {{ session.bar }}'
          }
        }
      };
      const session = { foo: 'some value', bar: 'some other value' };
      const page = new class extends Page {
        get url() {
          return '/my/page';
        }
        get template() {
          return 'page_views/simplePage';
        }
        get i18NextContent() {
          return contentWithSessionData;
        }
      }();
      page.locals = { session };
      expect(page.content.title).to.eql('some title some value');
      expect(page.content.subTitle).to.eql('some subtitle some other value');
    });

    it('returns empty content if no i18NextContent exsists', () => {
      const page = new class extends Page {
        get url() {
          return '/my/page';
        }
        get template() {
          return 'page_views/simplePage';
        }
      }();
      expect(page.content).to.eql({});
    });
  });

  it('has access to the session', () => {
    const page = new class extends Page {
      get url() {
        return '/my/page';
      }
      get template() {
        return 'page_views/session';
      }
    }();

    return testStep(page)
      .withSession({ foo: 'Foo', bar: 'Bar' })
      .get()
      .expect(OK, 'Foo Bar\n');
  });

  it('looks for a template named [Step.name] by default', () => {
    const page = new class TestPage extends Page {
      get url() {
        return '/page';
      }
    }();
    return testStep(page)
      .get()
      .expect(OK, 'Default Page template\n');
  });
});
