const test = require('ava');
const sinon = require('sinon');
const CoreStub = require('../helpers/mocks/core-stub');
const run = require('./run');

test.beforeEach((t) => {
  t.context.deps = {
    core: new CoreStub({
      ref: 'c92f0sd',
      latest_tag: '1.1.0',
      working_directory: '.',
    }),
    exec: sinon.stub().returns({}),
  };
});

test('finds all commits and respects rankings', async (t) => {
  t.context.deps.exec.returns({
    stdout: `--SUBJECT--chore: fix some lint issues
--BODY--
--SUBJECT--ci: need npm deps for title check
--BODY--
--SUBJECT--fix: update release info action
--BODY--
--SUBJECT--feat: use semver
--BODY--
--SUBJECT--chore: updated helpers
--BODY--
`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setOutput.calledWith('type', 'minor'));
  t.assert(t.context.deps.core.setOutput.calledWith('version', '1.2.0'));
});

test('commits that dont match conventional style treated as none', async (t) => {
  t.context.deps.exec.returns({
    stdout: `--SUBJECT--chore: fix some lint issues
--BODY--
--SUBJECT--ci: need npm deps for title check
--BODY--
--SUBJECT--fix: update release info action
--BODY--
--SUBJECT--use semver
--BODY--
--SUBJECT--chore: updated helpers
--BODY--
`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setOutput.calledWith('type', 'patch'));
  t.assert(t.context.deps.core.setOutput.calledWith('version', '1.1.1'));
});

test('breaking change discovered in subject and respected', async (t) => {
  t.context.deps.exec.returns({
    stdout: `--SUBJECT--chore: fix some lint issues
--BODY--
--SUBJECT--ci: need npm deps for title check
--BODY--
--SUBJECT--fix(a-thing): update release info action
--BODY--
--SUBJECT--feat!: use semver
--BODY--
--SUBJECT--chore: updated helpers
--BODY--
`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setOutput.calledWith('type', 'major'));
  t.assert(t.context.deps.core.setOutput.calledWith('version', '2.0.0'));
});

test('breaking change discovered in body and respected', async (t) => {
  t.context.deps.exec.returns({
    stdout: `--SUBJECT--chore: fix some lint issues
--BODY--
--SUBJECT--ci: need npm deps for title check
--BODY--
--SUBJECT--fix(a-thing): update release info action
--BODY--
--SUBJECT--feat: use semver
--BODY--BREAKING CHANGE
--SUBJECT--chore: updated helpers
--BODY--
`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setOutput.calledWith('type', 'major'));
  t.assert(t.context.deps.core.setOutput.calledWith('version', '2.0.0'));
});

test('commit range with highest release rank of none doesnt trigger release', async (t) => {
  t.context.deps.exec.returns({
    stdout: `--SUBJECT--fix some lint issues
--BODY--
--SUBJECT--need npm deps for title check
--BODY--
--SUBJECT--update release info action
--BODY--
--SUBJECT--need semver
--BODY--
--SUBJECT--updated helpers
--BODY--
--SUBJECT--gen changelog
--BODY--
`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setFailed.calledOnceWith('No commits can trigger a release'));
  t.assert(t.context.deps.core.setOutput.notCalled);
});
