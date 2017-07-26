const {expect} = require('test/util/chai');

const Step = require('app/core/Step');

const modulePath = 'app/core/OptionStep';
const UnderTest = require(modulePath);


class TrueTrue extends Step {

    get url () {return '/true:true';}
}

class TrueFalse extends Step {

    get url () {return '/true:false';}
}

class FalseTrue extends Step {

    get url () {return '/false:true';}
}

class FalseFalse extends Step {

    get url () {return '/false:false';}
}

class True extends Step {

    get url () {return '/true';}
}

class False extends Step {

    get url () {return '/false';}
}



class ExtendsUnderTest extends UnderTest {

    get url () {return '/test';}
    get nextStep () {

        return {
            prop1: {
                true: {
                    prop2: {
                        true: this.steps.TrueTrue,
                        false: this.steps.TrueFalse
                    }
                },
                false: {
                    prop2: {
                        true: this.steps.FalseTrue,
                        false: this.steps.FalseFalse
                    }
                }
            },
            prop3: {
                true: this.steps.True,
                false: this.steps.False
            },
            prop4: {
                true: this.steps.True
            },
            prop5: {
                true: this.steps.True,
                false: this.steps.False
            }

        };

    }
}

let steps;
let underTest;

describe(modulePath, () => {

    beforeEach(() => {

        steps = {
            TrueTrue: new TrueTrue(),
            TrueFalse: new TrueFalse(),
            FalseTrue: new FalseTrue(),
            FalseFalse: new FalseFalse(),
            True: new True(),
            False: new False()
        };

        underTest = new ExtendsUnderTest(steps, null, null, {},{properties: {}});
    });

    describe('#next()', () => {

        describe('error', () => {

            it('should throw an error with the correct message', () => {

                delete steps.TrueTrue;

                expect(() => underTest.next({prop1: true, prop2: true})).to.throw('Step ExtendsUnderTest has no valid next Step class at this.nextStep.prop1.true.prop2.true');
            });

        });


        describe('success', () => {

            describe('a simple single property data structure', () => {

                it('should select the correct Step if the property is true', () => {

                    let next = underTest.next({prop3: true});

                    expect(next).to.be.instanceof(True);
                });

                it('should select the correct Step if the property is false', () => {

                    let next = underTest.next({prop3: false});

                    expect(next).to.be.instanceof(False);
                });

            });

            describe('a complex nested multi property data structure', () => {

                it('should select the correct Step if both properties are true', () => {

                    let next = underTest.next({prop1: true, prop2: true});

                    expect(next).to.be.instanceof(TrueTrue);
                });

                it('should select the correct Step if both properties are false', () => {

                    let next = underTest.next({prop1: false, prop2: false});

                    expect(next).to.be.instanceof(FalseFalse);
                });

                it('should select the correct Step if property 1 is true and property 2 is false', () => {

                    let next = underTest.next({prop1: true, prop2: false});

                    expect(next).to.be.instanceof(TrueFalse);
                });

                it('should select the correct Step if property 1 is false and property 2 is true', () => {

                    let next = underTest.next({prop1: false, prop2: true});

                    expect(next).to.be.instanceof(FalseTrue);
                });

            });

            describe('ignoring a value that doesn\'t exist', () => {

                it('should select the correct Step if property 4 is false and property 5 is true', () => {

                    let next = underTest.next({prop4: false, prop5: true});

                    expect(next).to.be.instanceof(True);
                });


            });
        });

    });

});