const {find} = require('lodash');
const Step = require('./Step');
const ValidationStep = require('./ValidationStep');

module.exports = class OptionStep extends ValidationStep {

    constructor (steps, section, templatePath, content, schema) {

        super(steps, section, templatePath, content, schema);
    }


    next (data) {

        let error;
        let val = undefined;
        let path = [];

        const f = (v, k) => {

            if (!data.hasOwnProperty(k)) {

                return false;
            }

            path.push(k, data[k]);

            if (v[data[k]] instanceof Step) {

                val = v[data[k]];

                return true;
            }
            else if (typeof v[data[k]] === 'object') {

                return find(v[data[k]], f);
            }
            else {

                error = new ReferenceError(`Step ${this.name} has no valid next Step class at this.nextStep.${path.join('.')}`);
            }

        };

        find(this.nextStep, f);

        if (error && !val) {

            throw error;
        }

        return val;

    }

};