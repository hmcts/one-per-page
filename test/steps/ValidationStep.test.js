const co = require('co');
const requireDir = require('require-directory');
const {expect} = require('test/util/chai');

const modulePath = 'app/core/ValidationStep';
const UnderTest = require(modulePath);

const fixtures = requireDir(module, `${__dirname}/fixtures`);

let underTest;


describe(modulePath, () => {

    describe('#constructor()', () => {

        describe('error', () => {

            it('should throw an error with the correct message if an invalid schema is provided', () => {

                expect(() => new UnderTest({}, null, null, {}, {})).to.throw('Step ValidationStep has an invalid schema: schema has no properties or oneOf keywords');
            });
        });

        describe('success', () => {

            describe('a simple schema', () => {

                it('should generate the schema properties', () => {

                    underTest = new UnderTest({}, 'screening-questions', null, fixtures.content.simple, fixtures.schemas.simple);

                    expect(underTest.properties).to.deep.equal(fixtures.schemas.simple.properties);
                });

            });

            describe('a complexish schema', () => {

                it('should generate the schema properties', () => {

                    underTest = new UnderTest({}, 'screening-questions', null, fixtures.content.complex, fixtures.schemas.complex);

                    expect(underTest.properties).to.deep.equal({
                        marriageType: {type: 'string'},
                        divorceWho: {type: 'string'}
                    });
                });

            });

        });

    });

    describe('#validate()', () => {

        describe('error', () => {

            it('should throw an error if no error messages are provided', (done) => {

                co(function* () {

                    let underTest = new UnderTest({}, 'screening-questions', null, {}, fixtures.schemas.noMessage);

                    let error = false;

                    try {

                        yield underTest.validate({});
                    }
                    catch (e) {

                        error = e;
                    }

                    expect(error.message).to.equal('Error messages have not been defined for Step ValidationStep in content.json for errors.noMessage');

                }).then(done, done);
            });

        });


        describe('success', () => {

            describe('a simple schema', () => {

                beforeEach(() => {

                    underTest = new UnderTest({}, 'screening-questions', null, fixtures.content.simple, fixtures.schemas.simple);
                });

                it('should validate the given data', (done) => {

                    co(function* () {

                        let [isValid, errors] = yield underTest.validate({hasMarriageCert: 'Yes'});

                        expect(isValid).to.equal(true);
                        expect(errors).to.deep.equal([]);

                    }).then(done, done);
                });

                it('should validate the given data', (done) => {

                    co(function* () {

                        let [isValid, errors] = yield underTest.validate({hasMarriageCert: 'No'});

                        expect(isValid).to.equal(true);
                        expect(errors).to.deep.equal([]);

                    }).then(done, done);
                });

                it('should invalidate the given data', (done) => {

                    co(function* () {

                        let [isValid] = yield underTest.validate({});

                        expect(isValid).to.equal(false);

                    }).then(done, done);
                });

                it('should generate the correct error messages for missing required data', (done) => {

                    co(function* () {

                        let [, errors] = yield underTest.validate({});

                        expect(errors).to.deep.equal([
                            {param: 'hasMarriageCert', msg: fixtures.content.simple.resources.en.translation.errors.hasMarriageCert.required}
                        ]);

                    }).then(done, done);
                });

                it('should generate the correct error messages for invalid data', (done) => {

                    co(function* () {

                        let [, errors] = yield underTest.validate({hasMarriageCert: 'invalid'});

                        expect(errors).to.deep.equal([
                            {param: 'hasMarriageCert', msg: fixtures.content.simple.resources.en.translation.errors.hasMarriageCert.invalid}
                        ]);

                    }).then(done, done);
                });

            });

            describe('a complex-ish schema', () => {

                beforeEach(() => {

                    underTest = new UnderTest({}, 'screening-questions', null, fixtures.content.complex, fixtures.schemas.complex);
                });

                it('should validate the given data', (done) => {

                    co(function* () {

                        let [isValid, errors] = yield underTest.validate({
                            marriageType: 'marriage',
                            divorceWho: 'husband'
                        });

                        expect(isValid).to.equal(true);
                        expect(errors).to.deep.equal([]);

                    }).then(done, done);
                });

                it('should validate the given data', (done) => {

                    co(function* () {

                        let [isValid, errors] = yield underTest.validate({
                            marriageType: 'same-sex-marriage',
                            divorceWho: 'wife'
                        });

                        expect(isValid).to.equal(true);
                        expect(errors).to.deep.equal([]);

                    }).then(done, done);
                });

                it('should invalidate the given data', (done) => {

                    co(function* () {

                        let [isValid] = yield underTest.validate({
                            divorceWho: 'wife'
                        });

                        expect(isValid).to.equal(false);

                    }).then(done, done);
                });

                it('should invalidate the given data', (done) => {

                    co(function* () {

                        let [isValid] = yield underTest.validate({
                            marriageType: 'marriage',
                            divorceWho: 'former-partner'
                        });

                        expect(isValid).to.equal(false);

                    }).then(done, done);
                });

                it('should invalidate the given data', (done) => {

                    co(function* () {

                        let [isValid] = yield underTest.validate({});

                        expect(isValid).to.equal(false);

                    }).then(done, done);
                });

                it('should generate the correct error messages for missing data', (done) => {

                    co(function* () {

                        let [, errors] = yield underTest.validate({});

                        expect(errors).to.deep.equal([
                            { param: 'marriageType', msg: fixtures.content.complex.resources.en.translation.errors.marriageType.required},
                            { param: 'divorceWho', msg: fixtures.content.complex.resources.en.translation.errors.divorceWho.required}
                        ]);

                    }).then(done, done);
                });

                it('should generate the correct error messages for invalid data', (done) => {

                    co(function* () {

                        let [, errors] = yield underTest.validate({
                            marriageType: 'que?',
                            divorceWho: 'quoi?'
                        });

                        expect(errors).to.deep.equal([
                            { param: 'marriageType', msg: fixtures.content.complex.resources.en.translation.errors.marriageType.invalid},
                            { param: 'divorceWho', msg: fixtures.content.complex.resources.en.translation.errors.divorceWho.invalid}
                        ]);

                    }).then(done, done);
                });

            });

        });

    });

});