const BaseStep = require('./BaseStep');

class Page extends BaseStep {

  get template() {
    return this.name;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template);
    } else {
      res.sendStatus(405);
    }
  }

}

module.exports = Page;
