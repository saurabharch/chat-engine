const c = require('./config.js');
const assert = require('chai').assert;

let syncChat;

let newChannel = 'sync-chat' + new Date().getTime();
let newChannel2 = 'sync-chat2' + new Date().getTime();

describe('remote chat list', () => {

    beforeEach(c.createChatEngineClone);
    beforeEach(c.createChatEngineSync);
    afterEach(c.reset);

    it('should be get notified of new chats', function getNotifiedOfNewChats(done) {

        this.timeout(60000);
        let ChatEngineSync = c.ChatEngineSync;
        let ChatEngineClone = c.ChatEngineClone;

        // first instance looking or new chats
        ChatEngineSync.me.on('$.session.chat.join', (payload) => {

            if (payload.chat.channel.indexOf(newChannel) > -1) {
                done();
            }

        });

        syncChat = new ChatEngineClone.Chat(newChannel);

    });

    it('should be populated', function shouldBePopulated(done) {

        this.timeout(20000);
        let ChatEngineSync = c.ChatEngineSync;

        ChatEngineSync.me.once('$.session.group.restored', (payload) => {

            assert.isObject(ChatEngineSync.me.session[payload.group]);

            done();

        });

    });

    it('should get delete event', function deleteSync(done) {

        this.timeout(60000);
        let ChatEngineSync = c.ChatEngineSync;
        let ChatEngineClone = c.ChatEngineClone;

        ChatEngineSync.me.on('$.session.chat.leave', (payload) => {

            if (payload.chat.channel.indexOf(newChannel2) > -1) {
                done();
            }

        });

        // first instance looking or new chats
        ChatEngineSync.me.once('$.session.chat.join', () => {

            syncChat.leave();

        });

        syncChat = new ChatEngineClone.Chat(newChannel2);

    });

});
