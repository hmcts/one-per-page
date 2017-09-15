const { BaseStep } = require('@hmcts/one-per-page');

class CreateSession extends BaseStep {
  get url() {
    return '/create-session';
  }

  handler(req, res) {
    req.session.generate();
    req.session.username = 'Michael';
    req.session.Name_firstName = 'Michael';
    req.session.Name_lastName = 'Allen';
    res.redirect('/hello-world');
  }
}

module.exports = CreateSession;
