const Step = require('lib/opp/steps/Step');

class JoiValidationStep extends Step {

    get schema() {

        if (!this._schema) {

            throw new TypeError(`Step ${this.name} has no schema file in it's resource folder`);
        }

        return this._schema;
    }

    constructor(steps, section, templatePath, content, schema) {

        super(steps, section, templatePath, content);

        this._schema = schema;


    }

    * validate(data, session) {
        return [true, null];
    }
}

module.exports = JoiValidationStep;