const test = require('ava');
const FsStub = require('../helpers/mocks/fs-stub');
const CoreStub = require('../helpers/mocks/core-stub');
const GithubStub = require('../helpers/mocks/github-stub');
const run = require('./run');

test.beforeEach((t) => {
  t.context = {
    fs: new FsStub(),
    core: new CoreStub(),
    github: new GithubStub({ repo: 'x', owner: 'y' }),
  }
});

test('new release is created from data when releaseId not supplied', async (t) => {
  t.context.core.inputs = {
    token: 'token',
    owner: 'owner',
    repo: 'repo',
    name: 'Release',
    tag: 'v1',
    body: 'real body',
    body_base64: 'unused body',
    assets: 'path/to/file.txt, release.apk,random.zip',
    draft: 'false',
  };
  t.context.fs.data = {
    'path/to/file.txt': 'txt data',
    'release.apk': 'apk data',
    'random.zip': 'zip data',
  };
  t.context.github.client.repos.createRelease.returns({ data: { id: 'release id' } });

  const fileUploadPromise = await run(t.context);

  t.is(t.context.core.outputs['id'], 'release id');
  await fileUploadPromise;
  t.is(t.context.github.client.repos.uploadReleaseAsset.callCount, 3);
  t.assert(t.context.github.client.repos.uploadReleaseAsset.calledWith({
    repo: 'repo',
    owner: 'owner',
    release_id: 'release id',
    name: 'file.txt',
    data: 'txt data',
  }));
  t.assert(t.context.github.client.repos.uploadReleaseAsset.calledWith({
    repo: 'repo',
    owner: 'owner',
    release_id: 'release id',
    name: 'release.apk',
    data: 'apk data',
  }));
  t.assert(t.context.github.client.repos.uploadReleaseAsset.calledWith({
    repo: 'repo',
    owner: 'owner',
    release_id: 'release id',
    name: 'random.zip',
    data: 'zip data',
  }));
});
