const {expect} = require('test/util/chai');

const modulePath = 'app/core/parseRequest';
const underTest = require(modulePath);

let step;

describe(modulePath, () => {

    beforeEach(() => {

        step = {
            properties: {
                a: {type: 'string'},
                b: {type: 'string'},
                c: {type: 'number'},
                d: {type: 'integer'},
                e: {type: 'array'}
            }
        };

    });


    it('should strip the data from the request body', () => {

        let req = {
            body: {
                a: 'one',
                b: 'two',
                c: '3.1',
                d: '4',
                e: ['one', 'two']
            },
            method: 'post'
        };

        expect(underTest(step, req)).to.deep.equal({
            a: 'one',
            b: 'two',
            c: 3.1,
            d: 4,
            e: ['one', 'two']
        });
    });

    it('should ignore values not specified by the step properties', () => {

        let req = {
            body: {
                a: 'one',
                b: 'two',
                c: '3.1',
                d: '4',
                e: ['one', 'two'],
                f: 'ignore'
            },
            method: 'post'
        };

        expect(underTest(step, req)).to.deep.equal({
            a: 'one',
            b: 'two',
            c: 3.1,
            d: 4,
            e: ['one', 'two']
        });
    });


    it('should pass empty values through', () => {

        let req = {
            body: {
                a: '',
                b: '',
                c: '',
                d: '',
                e: []
            },
            method: 'post'
        };

        expect(underTest(step, req)).to.deep.equal({
            a: '',
            b: '',
            c: '',
            d: '',
            e: []
        });
    });


    it('if data type is array and has not been parsed in request, should create empty array', () => {

        let req = {
            body: {
                a: 'one',
                b: 'two',
                c: '3.1',
                d: '4'
            },
            method: 'post'
        };

        expect(underTest(step, req)).to.deep.equal({
            a: 'one',
            b: 'two',
            c: 3.1,
            d: 4,
            e: []
        });
    });


});