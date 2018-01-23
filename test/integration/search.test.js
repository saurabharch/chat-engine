const c = require('./config.js');
const assert = require('chai').assert;

let chatHistory;
describe('history', () => {

    beforeEach(c.createChatEngineHistory);
    afterEach(c.reset);

    it('should get 50 messages', function get50(done) {

        let count = 0;

        this.timeout(30000);
        let ChatEngineHistory = c.ChatEngineHistory;

        chatHistory = new ChatEngineHistory.Chat('chat-history-8', false);

        chatHistory.on('$.connected', () => {

            setTimeout(() => {

                chatHistory.search({
                    event: 'tester',
                    limit: 50
                }).on('tester', (a) => {

                    assert.equal(a.event, 'tester');

                    count += 1;

                }).on('$.search.finish', () => {
                    assert.equal(count, 50, 'correct # of results');
                    done();
                });

            }, 5000);

        });

    });

    it('should get 200 messages', function get200(done) {

        let count = 0;

        this.timeout(60000);
        let ChatEngineHistory = c.ChatEngineHistory;

        let chatHistory2 = new ChatEngineHistory.Chat('chat-history-3', false);

        chatHistory2.on('$.connected', () => {

            setTimeout(() => {

                chatHistory2.search({
                    event: 'tester',
                    limit: 200
                }).on('tester', (a) => {

                    assert.equal(a.event, 'tester');
                    count += 1;

                }).on('$.search.finish', () => {
                    assert.equal(count, 200, 'correct # of results');
                    done();
                });

            }, 5000);

        });

    });

    it('should get messages without event', function get50(done) {

        this.timeout(30000);

        chatHistory.search({
            limit: 10
        }).on('tester', (a) => {

            assert.equal(a.event, 'tester');

        }).on('$.search.finish', () => {
            done();
        });

    });

});
