const c = require('./config.js');
const assert = require('chai').assert;

describe('connection management', () => {

    beforeEach(c.createChatEngine);
    afterEach(c.reset);

    it('change user', function beIdentified(done) {

        let ChatEngine = c.ChatEngine;
        this.timeout(20000);

        let newUsername = 'stephen' + new Date().getTime();

        ChatEngine.once('$.disconnected', () => {

            ChatEngine = c.ChatEngineCore.create({
                publishKey: c.pubkey,
                subscribeKey: c.subkey
            }, {
                globalChannel: c.globalChannel,
                throwErrors: true
            });

            ChatEngine.once('$.ready', () => {

                done();

            });

            ChatEngine.connect(newUsername);

        });

        ChatEngine.disconnect();

    });

    it('should disconnect', function beIdentified(done) {

        let ChatEngine = c.ChatEngine;
        this.timeout(20000);

        let chat2 = new ChatEngine.Chat('disconnect' + new Date().getTime());

        chat2.on('$.connected', () => {

            // old chat may still be trying to call here_now
            setTimeout(() => {

                chat2.once('$.disconnected', () => {
                    done();
                });

                ChatEngine.disconnect();

            }, 5000);

        });

    });

    it('should refresh auth', function beIdentified(done) {

        this.timeout(20000);
        let ChatEngine = c.ChatEngine;

        let authKey = new Date().getTime();

        ChatEngine.reauthorize(authKey);

        ChatEngine.once('$.connected', () => {
            done();
        });

    });

});
