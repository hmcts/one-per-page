const {expect, sinon} = require('test/util/chai');

const modulePath = 'app/core/staleDataManager';

const staleDataManager = require(modulePath);

describe(modulePath, () => {

    describe('watch', () => {

        beforeEach(done => {

            staleDataManager._reset();
            done();

        });

        it('should add a single key to the watch list', () => {

            staleDataManager.watch('key');
            expect(Object.keys(staleDataManager._watches())).to.contain('key');

        });

        it('should add multiple keys to the watch list', () => {

            staleDataManager.watch(['key1', 'key2']);

            expect(Object.keys(staleDataManager._watches())).to.contain('key1');
            expect(Object.keys(staleDataManager._watches())).to.contain('key2');

        });

        it('should only add one instance of a key to the watches', () => {

            staleDataManager.watch('key');
            staleDataManager.watch('key');

            expect(Object.keys(staleDataManager._watches()).length).to.equal(1);

        });

    });

    describe('execute callbacks for watched fields', () => {

        beforeEach(done => {

            staleDataManager._reset();
            done();

        });

        it('should trigger a callback if item changed', () => {

            const session = {
                'key': 'value'
            };

            const callback = sinon.stub();
            staleDataManager.watch('key', callback);

            staleDataManager.removeStaleData({}, session);
            expect(callback.callCount).to.equal(1);

        });

        it('should trigger callback for each key added as an array', () => {

            const previousSession = {};

            const session = {
                'key': 'value',
                'key2': 'value'
            };

            const callback = sinon.stub();
            staleDataManager.watch(['key', 'key2'], callback);

            staleDataManager.removeStaleData(previousSession, session);

            expect(callback.callCount).to.equal(2);

        });

        it('should trigger callback for each key added seperatly', () => {

            const session = {
                'key': 'value',
                'key2': 'value'
            };

            const callback = sinon.stub();
            staleDataManager.watch('key', callback);
            staleDataManager.watch('key2', callback);

            staleDataManager.removeStaleData({}, session);

            expect(callback.callCount).to.equal(2);

        });

        it('should trigger callback for removed keys', () => {

            const previousSession = {
                'keyToRemove': 'value'
            };

            const session = {
                'key': 'value',
                'keyToRemove': 'value'
            };

            staleDataManager.watch('key', (previousSession, session, remove) => {
                remove('keyToRemove');
            });

            const callbackForRemovedKey = sinon.stub();
            staleDataManager.watch('keyToRemove', callbackForRemovedKey);

            staleDataManager.removeStaleData(previousSession, session);

            expect(callbackForRemovedKey.callCount).to.equal(1);

        });

        it('should only trigger callback for removed keys if they exsist in session', () => {

            staleDataManager.watch('key1', (previousSession, session, remove) => {
                remove('removedKeyNotInSession');
            });

            const callback = sinon.stub();
            staleDataManager.watch('removedKeyNotInSession', callback);

            staleDataManager.removeStaleData({}, {});

            expect(callback.callCount).to.equal(0);

        });

        it('should trigger only one callback per key', () => {

            const previousSession = {
                'keyToRemove': 'value'
            };

            const session = {
                'key1': 'value',
                'keyToRemove': 'value'
            };

            staleDataManager.watch('key1', (previousSession, session, remove) => {
                // remove key twice in attempt to trigger callback twice
                remove('keyToRemove');
                remove('keyToRemove');
            });

            const callbackForRemovedKey = sinon.stub();
            staleDataManager.watch('keyToRemove', callbackForRemovedKey);

            staleDataManager.removeStaleData(previousSession, session);

            expect(callbackForRemovedKey.callCount).to.equal(1);

        });

        it('should delete key from session', () => {

            const session = {
                'key1': 'value',
                'keyToRemove': 'value'
            };

            staleDataManager.watch('key1', (previousSession, session, remove) => {
                remove('keyToRemove');
            });

            staleDataManager.removeStaleData({}, session);

            expect(session.keyToRemove).to.equal(undefined);

        });

    });

});