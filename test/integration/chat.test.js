const c = require('./config.js');
const assert = require('chai').assert;
let chat;

describe('chat', () => {

    beforeEach(c.createChatEngine);
    afterEach(c.reset);

    it('should get me as join event', function getMe(done) {

        this.timeout(10000);
        let ChatEngine = c.ChatEngine;

        chat = new ChatEngine.Chat('chat-teser' + new Date().getTime());

        chat.on('$.online.*', (p) => {

            if (p.user.uuid === ChatEngine.me.uuid) {
                done();
            }

        });

    });

    it('should get connected callback', function getReadyCallback(done) {

        this.timeout(5000);
        let ChatEngine = c.ChatEngine;

        let chat2 = new ChatEngine.Chat('chat2' + new Date().getTime());
        chat2.on('$.connected', () => {

            done();

        });

    });

    it('should get message', function shouldGetMessage(done) {

        this.timeout(12000);

        chat.once('something', (payload) => {

            assert.isObject(payload);
            done();

        });

        setTimeout(() => {
            chat.emit('something', {
                text: 'hello world'
            });
        }, 1000);

    });

    it('should bind a plugin', () => {

        chat.plugin(c.examplePlugin());

        assert(chat.constructWorks, 'bound to construct');
        assert(chat.testPlugin.newMethod(), 'new method added');

    });

    it('should bind a prototype plugin', () => {

        let ChatEngine = c.ChatEngine;
        ChatEngine.proto('Chat', c.examplePlugin());

        let newChat = new ChatEngine.Chat('some-other-chat' + new Date().getTime());

        assert(newChat.constructWorks, 'bound to construct');
        assert(newChat.testPlugin.newMethod(), 'new method added');

    });

});
