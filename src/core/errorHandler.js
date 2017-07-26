let {curry} = require('lodash');
const co = require('co');

module.exports = (steps) => {

    return curry((req, res) => {
        res.status(404);

        const step = steps.Error404;
        return co(function*() {

            let content = yield step.generateContent();
            res.render(step.template, {content});
        });
    });
};