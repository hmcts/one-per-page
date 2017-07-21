const co = require('co');
const {curry, get, reduce, cloneDeep} = require('lodash');
const { removeStaleData } = require('./staleDataManager');
const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

module.exports = curry((step, req, res) => {

    //  extract data from the request
    let data = step.parseRequest(req);

    return co(function*() {

        //  get the session
        let session = req.session;

        const previousSession = cloneDeep(session);

        //  fetch the ctx from the session
        //  this is the set of data scoped to the steps section
        //  the section is generated when the app starts up and
        //  is passed into the step when it is instantiated (app.js)
        //  we are cloning it here so as to not tamper with the session
        //  out of the flow of the rendering pipeline

        let ctx;

        /** ------------------------------------------------------------------------------------------------------------
         *
         * Thoughts:
         * If we want this class to live within the framework the following piece of code needs to be defined within a
         * given step, step.properties for example refers to the properties of the schema which is set on and validated
         * using AJV within the ValidationStep class, in other words we are tightly coupled to a very specific validation
         * implementation. Ideally developers should be free to provide their own validation implementation.
         * There are many others out there but Joi is worth taking a look at and is extremely popular, Joi allows
         * cross field validation which Michael asked about.
         *
         * https://github.com/hapijs/joi.
         *
         * This class needs to be completely generic, we don't want anything specific in here whatsoever.
         *
         * -----------------------------------------------------------------------------------------------------------*/

        // schemaScope is used for addresses
        if (step.schemaScope) {
            ctx = cloneDeep(get(session, step.schemaScope, {}));
        } else {
            const stepProperties = step.properties ? Object.keys(step.properties) : {};
                ctx = reduce(stepProperties, (ctx, key) => {
                ctx[key] = get(session, key);
                return ctx;
            }, {});
        }

        //  update the ctx with any new data sent from the client
        ctx = Object.assign(ctx, data);

        //  intercept the request and process any incoming data
        //  here we can set data on the context before we validate
        //  eg, turn individual date fields (day, month, year) into a date
        ctx = yield step.interceptor(ctx, session);

        if (req.method.toLowerCase() !== 'post') {
            //  if we are not posting to the page
            //  we just want to render the page with the session for the page

            //  fetch all the content from the content files
            let content = yield step.generateContent(ctx, session);

            // if flash object is set it means we are rendering this page following a post and there are errors
            // so find the errors and render the page
            if (session.flash && session.flash.errors) {
                // find the errors on the page
                let [, errors] = yield step.validate(session.flash.ctx, session);

                //  map the context into data fields for use in templates and macros
                let fields = yield step.generateFields(session.flash.ctx, session);

                //  map the standard errors onto the fields
                fields = yield step.mapErrorsToFields(errors, fields);

                res.render(step.template, {content, fields, errors, session});

                //  remove any flash messages
                delete session.flash;
            }
            else {
                //  map the context into data fields for use in templates and macros
                let fields = yield step.generateFields(ctx, session);

                //  if we have been redirected to an error page, set the status as 500
                if (step.name === 'GenericError') {
                    res.status(500);
                }

                res.render(step.template, {content, fields, session});
            }
        }
        else {
            //  html forms post emtpy values as body.param = '', we need to strip these out
            //  of the data that we validate as json schema required fields
            //  expect the field to be absent
            ctx = reduce(ctx, (acc, v, k) => {
                if (v !== '') {
                    acc[k] = v;
                }
                return acc;
            }, {});

            //  then test whether the request is valid
            let [isValid, errors] = yield step.validate(ctx, session);

            if (!isValid) {
                // if not running unit tests
                if (process.env.NODE_ENV !== 'testing') {
                    // set the flash message
                    session.flash = {
                        errors: true,
                        ctx
                    };
                    // redirect to the referer - this prevents the form resubmission issue
                    res.redirect(step.url);
                }
                else {
                    //  fetch all the content from the content files
                    let content = yield step.generateContent(ctx, session);

                    //  map the context into data fields for use in templates and macros
                    let fields = yield step.generateFields(ctx, session);

                    //  map the standard errors onto the fields
                    fields = yield step.mapErrorsToFields(errors, fields);

                    //  render the template
                    res.render(step.template, {content, fields, errors, session});
                }
            }
            else {
                try {

                    //  perform any actions dependent upon the step being in a valid state
                    [ctx, session] = yield step.action(ctx, session);

                    // schemaScope is used for addresses
                    if (step.schemaScope) {
                        session[step.schemaScope] = ctx;
                    } else {
                        Object.assign(session, ctx);
                    }

                    session = removeStaleData(previousSession, session);
                    res.redirect(step.next(ctx).url);
                }
                catch (e) {
                    res.sendStatus(500);
                }
            }
        }

    }).catch((e) => {
        logger.error(e);
        res.redirect('/generic-error');
    });
});
