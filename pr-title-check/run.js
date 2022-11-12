const githubImport = require('@actions/github');
const coreImport = require('@actions/core');
const { commitMatcher } = require('../helpers/utils');

function run({ github = githubImport, core = coreImport } = {}) {
  const { title } = github.context.payload.pull_request;

  if (!title.match(commitMatcher)) {
    core.setFailed(`PR title "${title}" failed to pass match regex - ${commitMatcher}`);
  }
}

module.exports = run;

if (require.main === module) {
  run();
}
