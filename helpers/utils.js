const COMMIT_TYPES = Object.freeze({
  FEAT: 'feat',
  FIX: 'fix',
  BUILD: 'build',
  CHORE: 'chore',
  CI: 'ci',
  DOCS: 'docs',
  STYLE: 'style',
  REFACTOR: 'refactor',
  PERF: 'perf',
  TEST: 'test',
});

const commitMatcher = new RegExp(`^(?<type>${Object.values(COMMIT_TYPES).join('|')})(\\([^)]+\\))?(?<breaking>!)?:.*$`);

// takes a string and returns null if empty
function optionalInput(input) {
  if (input === '') {
    return null;
  }
  return input;
}

// takes string of boolean and returns boolean. null if empty
function optionalBooleanInput(input) {
  if (input === 'true') {
    return true;
  } if (input === 'false') {
    return false;
  }
  return null;
}

module.exports = {
  commitMatcher,
  COMMIT_TYPES,
  optionalInput,
  optionalBooleanInput,
};
