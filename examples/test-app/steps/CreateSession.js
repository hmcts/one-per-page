const { Page } = require('@hmcts/one-per-page');

class CreateSession extends Page {
  get url() {
    return '/create-session';
  }

  handler(req, res) {
    req.session.generate();
    req.session.username = 'Michael';
    req.session.Name_firstName = 'Michael';
    req.session.Name_lastName = 'Allen';
    res.redirect('/sessions');
  }
}

module.exports = CreateSession;
