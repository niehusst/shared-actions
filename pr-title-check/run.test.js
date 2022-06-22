const test = require('ava');
const sinon = require('sinon');
const GithubStub = require('../helpers/mocks/github-stub');
const CoreStub = require('../helpers/mocks/core-stub');
const run = require('./run');

test.beforeEach(t => {
    t.context.deps = {
        github: new GithubStub(),
        core: new CoreStub(),
    };
});

test('basic title pass', t => {
    t.context.deps.github.context = {
        payload: {
            pull_request: {
                title: 'fix: a thing'
            }
        }
    };

    run(t.context.deps);
    t.assert(t.context.deps.core.setFailed.notCalled);
});

test('completely incorrect title fail', t => {
    t.context.deps.github.context = {
        payload: {
            pull_request: {
                title: 'my first and worst PR'
            }
        }
    };

    run(t.context.deps);
    t.assert(t.context.deps.core.setFailed.calledOnce);
});

test('complex title pass', t => {
    t.context.deps.github.context = {
        payload: {
            pull_request: {
                title: 'feat(ticket-32)!: implement the stuff'
            }
        }
    };

    run(t.context.deps);
    t.assert(t.context.deps.core.setFailed.notCalled);
});

test('colon spacing fail', t => {
    t.context.deps.github.context = {
        payload: {
            pull_request: {
                title: 'chore : bad spacing'
            }
        }
    };

    run(t.context.deps);
    t.assert(t.context.deps.core.setFailed.calledOnce);
});

test('missed colon fail', t => {
    t.context.deps.github.context = {
        payload: {
            pull_request: {
                title: 'ci(ticket) do things'
            }
        }
    };

    run(t.context.deps);
    t.assert(t.context.deps.core.setFailed.calledOnce);
});
