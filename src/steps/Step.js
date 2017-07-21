const {forEach, mapValues} = require('lodash');
const i18next = require('i18next');
const {Router} = require('express');
const walkMap = require('../utils/treeWalker');
const parseRequest = require('../core/parseRequest');

const throwNotImplemented = (func) => {
    throw new ReferenceError(`Steps must override #${func}`);
};

module.exports = class Step {

    get ignorePa11yErrors () { return []; }
    get ignorePa11yWarnings () { return []; }
    get urlToBind () { return this.url;}

    get url () { throwNotImplemented('url'); }
    get nextStep () { throwNotImplemented('nextStep'); }

    get name () { return this.constructor.name;}
    get commonProps() {}

    get template () {

        if (!this.templatePath) {

            throw new TypeError(`Step ${this.name} has no template file in it's resource folder`);
        }

        return `${this.templatePath}/template`;
    }

    get fields () {
        return [];
    }

    constructor (steps, section = null, templatePath, content) {

        this.steps = steps;
        this.section = section;
        this.templatePath = templatePath;
        this.content = content;
        this.i18next = i18next.createInstance();
        this.i18next.init(content, (err) => {
            if (err) {
                process.emit('applicaton-log', {
                    level: 'ERROR',
                    message: 'divorce-application-i18n. Failed to initialise i18next',
                    fields: {
                        step: this.name,
                        error: err.message
                    }
                });
            }
        });
    }

    parseRequest (req) {
        return parseRequest(this, req);
    }

    next (/*ctx*/) {

        return this.nextStep;
    }

    * interceptor (ctx/*, session*/) {
        return ctx;
    }

    * validate (/*ctx, session*/) {

        return [true, []];
    }

    * generateContent (ctx, session, lang = 'en') {

        if (!this.content) {

            throw new ReferenceError(`Step ${this.name} has no content.json in it's resource folder`);
        }

        const contentCtx = Object.assign({}, session, ctx, this.commonProps);

        this.i18next.changeLanguage(lang);

        return walkMap(this.content.resources.en.translation.content, (path/*, content*/) => this.i18next.t('content.' + path, contentCtx));
    }

    * generateFields (ctx/*, session*/) {

        return mapValues(ctx, (v) => ({value: v, error: false}));
    }

    * mapErrorsToFields (errors = [], fields) {

        forEach(errors, (e) => {

            //  we may be generating errors for data we've created in #interceptor
            //  which won't get created in generate fields as it's based upon
            //  the incoming ctx
            if (!fields[e.param]) {

                fields[e.param] = {};
            }

            fields[e.param].error = true;
            fields[e.param].errorMessage = e.msg;
        });

        return fields;
    }

    * action (ctx, session) {

        return [ctx, session];
    }

    get middleware() { return []; }
    handler(/*req, res*/) {  }

    get router() {
        if (this._router) return this._router;
        else {
            this._router = Router();
            this.middleware.forEach((middleware) => {
                this._router.use(this.urlToBind, middleware.bind(this));
            });
            this._router.use(this.urlToBind, this.handler.bind(this));
            return this._router;
        }
    }

};
