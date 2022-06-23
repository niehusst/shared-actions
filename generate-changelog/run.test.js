const test = require('ava');
const sinon = require('sinon');
const CoreStub = require('../helpers/mocks/core-stub');
const run = require('./run');

test.beforeEach(t => {
  t.context.deps = {
    core: new CoreStub(),
    exec: sinon.stub().returns({});
  };
});

test('', async (t) => {

});
