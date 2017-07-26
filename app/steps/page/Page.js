const Step = require('lib/opp/steps/Step');
const loadContent = require('app/middleware/loadContent');

//TODO: app.js also brings locals in?
//const locals = require('app/middleware/locals');

/**
 *
 * Thoughts:
 * The question is should this live in application code or within the framework.
 * This page has dependencies on application code such as middleware which we wouldn't want
 * in the framework. This class requires app/middleware/locals, app.js does the same thing  - not sure if that's intended.
 * */

class Page extends Step {

    get middleware() {
        return [
            //locals,
            loadContent
        ];
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