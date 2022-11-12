const Promise = require('bluebird');
const path = require('path');
const githubImport = require('@actions/github');
const coreImport = require('@actions/core');
const fsImport = require('fs').promises;
const { optionalInput, optionalBooleanInput } = require('../helpers/utils');

async function run({
  github = githubImport,
  core = coreImport,
  fs = fsImport,
}) {
  core.info('Starting...');
  const token = core.getInput('token', { required: true });
  const owner = optionalInput(core.getInput('owner', { required: false }));
  const repo = optionalInput(core.getInput('repo', { required: false }));
  const name = core.getInput('name', { required: true });
  let releaseId = optionalInput(core.getInput('release_id', { require: false }));
  const tag = core.getInput('tag', { required: true });
  const bodyText = optionalInput(core.getInput('body', { required: false }));
  const bodyBase64 = optionalInput(core.getInput('body_base64', { required: false }));
  const assets = optionalInput(core.getInput('assets', { required: false }));
  const draft = optionalBooleanInput(core.getInput('draft', { required: false }));

  let body = '';
  if (bodyText) {
    body = bodyText;
  } else if (bodyBase64) {
    body = Buffer.from(bodyBase64, 'base64').toString('utf-8');
  }

  const { repoCtx } = github.context;
  const repoInfo = {
    repo: repo || repoCtx.repo,
    owner: owner || repoCtx.owner,
  };

  const client = github.getOctokit(token).rest;
  if (releaseId) {
    core.info(`Updating release ${releaseId}`);

    // update existing release
    await client.repos.updateRelease({
      ...repoInfo,
      release_id: releaseId,
      tag_name: tag,
      body,
      draft,
    });
  } else {
    // create new release
    core.info('Creating a new release!');

    const { data: release } = await client.repos.createRelease({
      ...repoInfo,
      tag_name: tag,
      name,
      body,
      draft,
    });

    core.info(`Finished creating release with ID ${release.id}`);
    releaseId = release.id;
  }

  let testOutput;
  if (assets) {
    const files = assets.split(',').map((f) => f.trim());
    core.info(`Uploading files ${files}`);

    // dont wait for file upload for action performance,
    // but save the promise for tests to wait for completion
    testOutput = Promise.each(files, async (file) => {
      const assetName = path.basename(file);
      const data = await fs.readFile(file);

      await client.repos.uploadReleaseAsset({
        ...repoInfo,
        release_id: releaseId,
        name: assetName,
        data,
      });
    });
  }

  core.setOutput('id', releaseId);
  return testOutput;
}

module.exports = run;

if (require.main === 'module') {
  run().catch((e) => {
    console.error(e);
    coreImport.setFailed(e);
  });
}
