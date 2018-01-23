const c = require('./config.js');
const assert = require('chai').assert;

let createdEventChat1;
let createdEventChat2;
describe('connect', () => {

    beforeEach(c.createChatEngine);
    afterEach(c.reset);

    it('should be identified as new user', function beIdentified() {

        this.timeout(16000);
        let ChatEngine = c.ChatEngine;

        assert.isObject(c.ChatEngine.me);

        ChatEngine.on('$.network.*', (data) => {
            console.log(data.operation);
        });

    });

    it('should notify chatengine on created', function join(done) {

        this.timeout(6000);
        let ChatEngine = c.ChatEngine;

        let newChat = 'this-is-only-a-test-3' + new Date().getTime();
        let a = false;

        ChatEngine.on('$.created.chat', (data, source) => {

            let lookingFor = c.globalChannel + '#chat#public.#' + newChat;

            if (source.channel === lookingFor) {
                done();
            }

        });

        a = new ChatEngine.Chat(newChat);

        setTimeout(() => {
            a.leave();
        }, 1000);

    });

    it('should notify chatengine on connected', function join(done) {

        this.timeout(10000);
        let ChatEngine = c.ChatEngine;

        ChatEngine.on('$.connected', (data, source) => {

            assert.isObject(source);
            if (source.channel === createdEventChat1.channel) {
                done();
            }
        });

        createdEventChat1 = new ChatEngine.Chat('this-is-only-a-test' + new Date());

    });

    it('should notify chatengine on disconnected', function disconnected(done) {

        this.timeout(4000);
        let ChatEngine = c.ChatEngine;

        ChatEngine.on('$.disconnected', (data, source) => {

            assert.isObject(source);

            if (source.channel === createdEventChat2.channel) {
                done();
            }
        });

        createdEventChat2 = new ChatEngine.Chat('this-is-only-a-test-2' + new Date());

        createdEventChat2.on('$.connected', () => {
            createdEventChat2.leave();
        });

    });

});
