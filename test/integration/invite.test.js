const c = require('./config.js');
const assert = require('chai').assert;

let myChat;

let yourChat;

let privChannel = 'secret-channel-' + new Date().getTime();

describe('invite', () => {

    beforeEach(c.createChatEngine);
    beforeEach(c.createChatEngineYou);
    afterEach(c.reset);

    it('two users are able to talk to each other in private channel', function shouldInvite(done) {

        this.timeout(60000);
        let ChatEngineYou = c.ChatEngineYou;
        let ChatEngine = c.ChatEngine;

        yourChat = new ChatEngineYou.Chat(privChannel);

        yourChat.on('$.connected', () => {

            // me is the current context
            yourChat.invite(ChatEngine.me);

        });

        yourChat.on('message', (payload) => {

            assert.equal(payload.data.text, 'sup?');
            done();

        });

        ChatEngine.me.direct.on('$.invite', (payload) => {

            myChat = new ChatEngine.Chat(payload.data.channel);

            myChat.on('$.connected', () => {

                setTimeout(() => {

                    myChat.emit('message', {
                        text: 'sup?'
                    });

                }, 5000);

            });

        });

    });

});
