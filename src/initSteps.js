const {curry, forEach} = require('lodash');
const logger = require('@hmcts/nodejs-logging').getLogger(__filename);

const steps = {};

module.exports = (app, stepDefinitions) => {
    const initStep = curry((modulePath, def, k) => {

        modulePath = modulePath ? `${modulePath}/${k}` : k;

        if (typeof def.index === 'function') {
            let section = modulePath.split('/');
            section.pop();
            section = section.join('.');

            try {
                const s = new def.index(steps, section, modulePath, def.content, def.schema);
                app.use(s.router);
                steps[s.name] = s;
            }
            catch (e) {
                logger.error({
                    message: `Failed to initialise step: ${e.message}`,
                    stacktrace: e.stack,
                    section, modulePath
                });
                throw e;
            }

        }
        else {
            forEach(def, initStep(modulePath));
        }

    });

    forEach(stepDefinitions, initStep(null));

    return steps;
};