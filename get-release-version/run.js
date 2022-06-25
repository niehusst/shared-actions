const semver = require('semver');
const coreImport = require('@actions/core');
const execImport = require('util').promisify(require('child_process').exec);
const { commitMatcher, COMMIT_TYPES } = require('../helpers/utils');

const releaseRank = {
  none: 0,
  patch: 1,
  minor: 2,
  major: 3,
};

const subjectHeader = '--SUBJECT--';
const bodyHeader = '--BODY--';

async function run({ core = coreImport, exec = execImport } = {}) {
  const latestTag = core.getInput('latest_tag', { required: true });
  const ref = core.getInput('ref', { required: true });
  const workingDirectory = core.getInput('working_directory', { required: true });

  const { stdout: commits } = await exec(
    `git --no-pager log --ancestry-path --no-merges --format="${subjectHeader}%s%n${bodyHeader}%b" ${latestTag}..${ref}`,
    { cwd: workingDirectory },
  );

  let releaseType = 'none';

  // eslint-disable-next-line no-restricted-syntax
  for (const commit of commits.trim().split(subjectHeader)) {
    const [subject, body] = commit.split(bodyHeader);
    const commitMatched = subject.trim().match(commitMatcher);
    if (commitMatched) {
      const [/* full match */, type, /* scope */, breaking] = commitMatched;

      // breaking changes can be marked in either commit title or body
      if (breaking || (body && body.match('BREAKING CHANGE'))) {
        releaseType = 'major';
        break;
      }

      let currReleaseType;
      switch (type) {
        case COMMIT_TYPES.FEAT:
          currReleaseType = 'minor';
          break;
        case COMMIT_TYPES.FIX:
        case COMMIT_TYPES.PERF:
        case COMMIT_TYPES.REFACTOR:
          currReleaseType = 'patch';
          break;
        default:
          currReleaseType = 'none';
          break;
      }

      if (releaseRank[releaseType] < releaseRank[currReleaseType]) {
        releaseType = currReleaseType;
      }
    }
  }

  if (releaseType === 'none') {
    core.setFailed('No commits can trigger a release');
    return;
  }

  const coercedVersion = semver.coerce(latestTag);
  const nextVersion = semver.inc(coercedVersion, releaseType);

  core.setOutput('type', releaseType);
  core.setOutput('version', nextVersion);
}

module.exports = run;

if (require.main === 'module') {
  run().catch((e) => {
    console.error(e);
    coreImport.setFailed(e);
  });
}
