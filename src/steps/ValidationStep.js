const {filter, isEqual, map, mapValues, reduce, uniqWith} = require('lodash');
const Ajv = require('ajv');
const Step = require('lib/opp/steps/Step');

/**
 *
 * Thoughts:
 * Should this class live within the framework or application cocde?
 * If we want this class to live within the framework then we should remove
 * the middleware dependencies, maybe they could be passed in via a constructor or configured another way.
 * Alternatively we could leave it here and let the devs validate their own data, however, it would be nice
 * to have a default validation in place.
 *
 * */

// const {protect} = require('app/services/idam');
// const initSession = require('app/middleware/initSession');
// const decryptSession = require('app/middleware/decryptSession');
// const sessionTimeout = require('app/middleware/sessionTimeout');
// const {features} = require('@divorce/feature-toggle')().featureToggles;


const ajv = new Ajv({allErrors: true, v5: true});

module.exports = class ValidationStep extends Step {

    // get middleware() {
    //     const protectCall = protect();
    //     const idamProtect = (req, res, next) => {
    //         return features.idam ? protectCall(req, res, next) : next();
    //     };
    //
    //     return [idamProtect, initSession, decryptSession, sessionTimeout];
    // }

    get schema() {

        if (!this.schemaFile) {

            throw new TypeError(`Step ${this.name} has no schema file in it's resource folder`);
        }

        return this.schemaFile;
    }

    constructor (steps, section, templatePath, content, schema) {

        super(steps, section, templatePath, content);

        this.schemaFile = schema;
        this.validateSchema = ajv.compile(this.schema);
        this.properties = this.uniqueProperties(this.schema);
    }

    uniqueProperties (schema) {

        if (schema.properties) {

            return schema.properties;
        }

        if (schema.oneOf) {

            let properties = reduce(schema.oneOf, (acc, s) => {

                Object.assign(acc, s.properties);
                return acc;
            }, {});

            return mapValues(properties, (v) => ({type: v.type}));
        }

        throw new Error(`Step ${this.name} has an invalid schema: schema has no properties or oneOf keywords`);
    }

    * validate (data, session) {

        let [isValid, errors] = [true, {}];

        if (data) {

            //    validate data against associated schema if there is one
            isValid = this.validateSchema(data);

            //    map the errors from the validator to the correct ones in the schema
            errors = isValid ? [] : this.mapErrors(this.validateSchema.errors, data, session);
        }

        return [isValid, errors];
    }

    mapErrors (errs, ctx, session) {

        const contentCtx = Object.assign({}, session, ctx, this.commonProps);
        errs = filter(errs, (e) => e.keyword !== 'oneOf');

        let errors = map(errs, (e) => {

            let param;
            let msg;
            let key;

            try {

                if (e.keyword === 'required' || e.keyword === 'switch') {

                    param = e.params.missingProperty;
                    key = `errors.${param}.required`;
                    msg = this.i18next.t(key, contentCtx);
                    if (msg === key) {
                        throw new ReferenceError();
                    }
                }

                else {

                    [, param] = e.dataPath.split('.');
                    key = `errors.${param}.invalid`;
                    msg = this.i18next.t(key, contentCtx);
                    if (msg === key) {
                        throw new ReferenceError();
                    }
                }

                return {param, msg};
            }
            catch (e) {

                throw new ReferenceError(`Error messages have not been defined for Step ${this.name} in content.json for errors.${param}`);
            }

        });

        return uniqWith(errors, isEqual);
    }
};