const assert = require('chai').assert;
const sinon = require('sinon');
const Bootstrap = require('../../../src/bootstrap');
const Emitter = require('../../../src/modules/emitter');

describe('#emitter', () => {
    let emitterInstance = null;
    let chatEngineInstance = null;

    beforeEach(() => {
        chatEngineInstance = Bootstrap({ globalChannel: 'common', insecure: true }, { publishKey: 'demo', subscribeKey: 'demo' });
        emitterInstance = new Emitter(chatEngineInstance);

        // mock pubnub
        chatEngineInstance.pubnub = {
            addListener: sinon.spy()
        };

    });

    it('should successfully create an instance', (done) => {
        assert.isObject(emitterInstance, 'was successfully created');
        done();
    });

    it('should listen to an event', (done) => {
        emitterInstance.on('foo', (msg) => {
            assert(msg === 'hello world', 'got the expected value');
            done();
        });

        emitterInstance._emit('foo', 'hello world');
    });

    it('should accept a plugin', (done) => {
        let plugin = () => {
            class extension {
            }

            return {
                namespace: 'demo',
                extends: {
                    Emitter: extension
                }
            };
        };

        emitterInstance.plugin(plugin());
        assert(emitterInstance.plugins.length === 1, 'plugin works!');
        done();
    });

    it('should get a string state', (done) => {
        emitterInstance.set('stringKey', 'hello world');
        assert(emitterInstance.get('stringKey') === 'hello world', 'got the expected value');
        done();
    });

    it('should get an object state', (done) => {
        emitterInstance.set('objectKey', { users: 12, chatName: 'test' });
        assert.deepEqual(emitterInstance.get('objectKey'), { users: 12, chatName: 'test' });
        done();
    });

    it('should remove a state', (done) => {
        emitterInstance.set('integerKey', 10);
        emitterInstance.set('integerKey', null);

        assert.isUndefined(emitterInstance.get('integerKey'));
        done();
    });

    it('should manage state from a plugin', (done) => {

        let plugin = () => {
            class extension {
                construct() {
                    this.set('stringKey', 'plugin state');
                }
            }

            return {
                namespace: 'demo_plugin',
                extends: {
                    Emitter: extension
                }
            };
        };

        emitterInstance.plugin(plugin());

        assert(emitterInstance.plugins.length === 1, 'plugin works!');
        assert(emitterInstance.demo_plugin.get('stringKey') === 'plugin state', 'got the expected value');

        done();
    });

    it('should not allow to overwrite a plugin', (done) => {
        let plugin1 = () => {
            class extension {
                construct() {
                    this.set('stringKey', 'plugin state');
                }
            }

            return {
                namespace: 'demo_plugin',
                extends: {
                    Emitter: extension
                }
            };
        };

        let plugin2 = () => {
            class extension {
                construct() {
                    this.set('stringKey', 'new plugin state');
                }
            }

            return {
                namespace: 'demo_plugin',
                extends: {
                    Emitter: extension
                }
            };
        };

        emitterInstance.plugin(plugin1());
        emitterInstance.plugin(plugin2(), (result) => {
            assert(!result, 'got the expected value');
            assert(emitterInstance.demo_plugin.get('stringKey') === 'plugin state', 'got the expected value');

            done();
        });
    });

    it('should remove a plugin', (done) => {
        let plugin = () => {
            class extension {
            }

            return {
                namespace: 'demo_plugin',
                extends: {
                    Emitter: extension
                }
            };
        };

        emitterInstance.plugin(plugin());
        emitterInstance.removePlugin(plugin(), (result) => {
            assert(result, 'got the expected value');
            assert(emitterInstance.plugins.length === 0, 'got the expected value');

            done();
        });
    });

    it('should not remove a plugin no longer available', (done) => {
        let plugin = () => {
            class extension {
            }

            return {
                namespace: 'demo_plugin',
                extends: {
                    Emitter: extension
                }
            };
        };

        emitterInstance.removePlugin(plugin(), (result) => {
            assert(!result, 'got the expected value');
            done();
        });
    });
});
