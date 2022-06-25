const test = require('ava');
const sinon = require('sinon');
const CoreStub = require('../helpers/mocks/core-stub');
const run = require('./run');

test.beforeEach((t) => {
  t.context.deps = {
    core: new CoreStub({
      ref: 'v1.1.0',
      working_directory: '.',
    }),
    exec: sinon.stub().returns({}),
  };
});

test('fix/feat commit messages generate changelog', async (t) => {
  t.context.deps.core.inputs.since_ref = 'c824e0';
  t.context.deps.exec.returns({
    stdout: `fix: commit 1 (person2)
feat: commit 2 (person1)
fix: commit 3 (person1)`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.exec.calledOnceWith(
    'git --no-pager log --no-merges --reverse --format="%s (%an)" --ancestry-path c824e0..v1.1.0',
  ));
  t.assert(t.context.deps.core.setOutput.calledWith('changelog_base64', 'CiMjIEZlYXR1cmVzCgogLSBmZWF0OiBjb21taXQgMiAocGVyc29uMSkKCiMjIEZpeGVzCgogLSBmaXg6IGNvbW1pdCAxIChwZXJzb24yKQogLSBmaXg6IGNvbW1pdCAzIChwZXJzb24xKQo='));
});

test('non fix/feat commits dont generate changelog', async (t) => {
  t.context.deps.exec.returns({
    stdout: `perf: commit 1 (person2)
ci: commit 2 (person1)
test: commit 3 (person1)
malformed commit (person2)`,
  });

  await run(t.context.deps);
  t.assert(t.context.deps.core.setOutput.calledWith('changelog_base64', 'CiMjIEZlYXR1cmVzCgpOb25lCgojIyBGaXhlcwoKTm9uZQo='));
  t.assert(t.context.deps.exec.calledOnceWith(
    'git --no-pager log --no-merges --reverse --format="%s (%an)"  v1.1.0',
  ));
});
