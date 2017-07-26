const {reduce, isArray} = require('lodash');
const xssFilters = require('xss-filters');

module.exports = function (step, req) {

    const {body, params, query} = req;

    return reduce(step && step.properties || {}, function (acc, v, k) {

        switch (true) {

            case body.hasOwnProperty(k):

                acc[k] = body[k];
                break;

            case params && params.hasOwnProperty(k):

                acc[k] = params[k];
                break;

            case query && query.hasOwnProperty(k):

                acc[k] = query[k];
                break;

            default:

                //  if data has not been passed from post, that expects an array, create one
                if (req.method.toLowerCase() === 'post' && v.type === 'array') {

                    acc[k] = [];
                }

        }

        if (acc[k] !== undefined) {

            if (isArray(acc[k])) {
                acc[k] = acc[k].map(val => xssFilters.inHTMLData(val));
            }
            else {
                acc[k] = xssFilters.inHTMLData(acc[k]);
            }

        }

        if (v.type === 'number' && acc[k]) {

            acc[k] = parseFloat(acc[k]);
        }

        if (v.type === 'integer' && acc[k]) {

            acc[k] = parseInt(acc[k], 10);
        }

        return acc;
    }, {});

};