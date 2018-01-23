const c = require('./config.js');
const assert = require('chai').assert;

describe('import', () => {

    it('ChatEngine should be imported', () => {
        assert.isObject(c.ChatEngineCore, 'was successfully created');
    });

});
