let username = 'ian' + new Date().getTime();
let yousername = 'stephen' + new Date().getTime();

let ceCore = require('../../src/index.js');

let pubkey = 'pub-c-fab5d74d-8118-444c-b652-4a8ee0beee92';
let subkey = 'sub-c-696d9116-c668-11e7-afd4-56ea5891403c';

let generateGlobal = function() {
    return 'tester' + new Date().getTime();
};

let throwErrors = true;

let config = {
    pubkey,
    subkey,
    globalChannel: generateGlobal(),
    ChatEngineCore: ceCore,
    ChatEngine: false,
    ChatEngineYou: false,
    ChatEngineClone: false,
    ChatEngineSync: false,
    ChatEngineHistory: false,
    createChatEngine: function ce(done) {

        this.timeout(15000);

        config.ChatEngine = ceCore.create({
            publishKey: pubkey,
            subscribeKey: subkey
        }, {
            globalChannel: generateGlobal(),
            throwErrors: throwErrors
            // , debug: true
        });
        config.ChatEngine.connect(username, { works: true }, username);
        config.ChatEngine.on('$.ready', () => {
            done();
        });

    },
    createChatEngineSync: function ceSync(done) {

        this.timeout(15000);

        config.ChatEngineSync = ceCore.create({
            publishKey: pubkey,
            subscribeKey: subkey
        }, {
            globalChannel: generateGlobal(),
            enableSync: true,
            throwErrors: throwErrors
        });

        config.ChatEngineSync.connect(username, { works: false }, username);
        config.ChatEngineSync.on('$.ready', () => {
            done();
        });

    },
    createChatEngineClone: function ceClone(done) {

        this.timeout(15000);

        config.ChatEngineClone = ceCore.create({
            publishKey: pubkey,
            subscribeKey: subkey
        }, {
            globalChannel: generateGlobal(),
            enableSync: true,
            throwErrors: true
        });
        config.ChatEngineClone.connect(username, { works: true }, username);
        config.ChatEngineClone.on('$.ready', () => {
            done();
        });

    },
    createChatEngineYou: function ceYou(done) {

        this.timeout(15000);

        config.ChatEngineYou = ceCore.create({
            publishKey: pubkey,
            subscribeKey: subkey
        }, {
            globalChannel: generateGlobal(),
            throwErrors: throwErrors
        });
        config.ChatEngineYou.connect(yousername, { works: true }, yousername);
        config.ChatEngineYou.on('$.ready', () => {
            done();
        });

    },
    createChatEngineHistory: function ceHistory(done) {

        this.timeout(15000);

        config.ChatEngineHistory = ceCore.create({
            publishKey: pubkey,
            subscribeKey: subkey
        }, {
            globalChannel: 'global',
            throwErrors: throwErrors
        });
        config.ChatEngineHistory.connect(yousername, { works: true }, yousername);
        config.ChatEngineHistory.on('$.ready', () => {
            done();
        });

    },
    reset: () => {

        let instances = [config.ChatEngine, config.ChatEngineYou, config.ChatEngineClone, config.ChatEngineSync, config.ChatEngineHistory];

        // for every instance of chatengine
        instances.forEach((instance) => {

            // if the instance is a real chatengine instance
            if (instance) {
                instance.disconnect();
                // unregister all event listeners
                instance.destroy();
            }

            // remove the instance from memory
            instance = false;

        });

    },
    examplePlugin: function examplePlugin() {

        class extension {
            construct() {
                this.parent.constructWorks = true;
            }
            newMethod() {
                return this.parent.constructWorks;
            }
        }

        return {
            namespace: 'testPlugin',
            extends: {
                Chat: extension
            },
            middleware: {
                send: {
                    message: (payload, next) => {
                        payload.send = true;
                        next(null, payload);
                    }
                },
                broadcast: {
                    message: (payload, next) => {
                        payload.broadcast = true;
                        next(null, payload);
                    }
                }
            }
        };

    }

};

module.exports = config;
