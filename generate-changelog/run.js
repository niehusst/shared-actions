const coreImport = require('@actions/core');
const execImport = require('utils').promisify(require('child_process').exec);

function makeList(array) {
  if (array.length === 0) {
    return 'None';
  }
  return array.map((v) => ` - ${v}`).join('\n');
}

async function run({ core = coreImport, exec = execImport }) {
  const startRef = core.getInput('since_ref', { required: false });
  const ref = core.getInput('ref', { required: true });
  const workingDirectory = core.getInput('working_directory', { required: true });

  let refRange = ref;
  let ancestryFlag = '';

  if (startRef) {
    refRange = `${startRef}..${ref}`;
    ancestryFlag = '--ancestry-path';
  }

  const { stdout: commits } = await exec(
    `git --no-pager log --no-merges --reverse --format="%s (%an)" ${ancestryFlag} ${refRange}`,
    { cwd: workingDirecotry },
  );

  let changelog;

  if (commits) {
    const feats = [];
    const fixes = [];

    commits.split('\n').forEach((commit) => {
      if (commit.match(/^feat/m)) {
        feats.push(commit);
        return; // aka continue
      }
      if (commit.match(/^fix/m)) {
        fixes.push(commit);
      }
    });

    changelog = `
## Features

${feats.map((commit) => ` * ${commit}`).join('\n')}

## Fixes

${fixes.map((commit) => ` * ${commit}`).join('\n')}
`;
  } else {
    changelog = 'No changes';
  }

  const changelogBase64 = Buffer.from(changelog, 'utf-8').toString('base64');
  core.setOutput('changelog_base64', changelogBase64);
}

module.exports = run;

if (require.main === 'module') {
  run().catch((e) => {
    console.error(e);
    coreImport.setFailed(e);
  });
}
