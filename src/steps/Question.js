const BaseStep = require('./BaseStep');
const requireSession = require('./../middleware/requireSession');

class Question extends BaseStep {
  get middleware() {
    return [requireSession];
  }

  get template() {
    return this.name;
  }

  handler(req, res) {
    if (req.method === 'GET') {
      res.render(this.template);
    } else {
      // handle post
    }
  }
}

module.exports = Question;
