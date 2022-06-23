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

const commitMatcher = new RegExp(`^(?<type>${Object.values(COMMIT_TYPES).join('|')})(\([^)]+\))?(?<breaking>!)?:.*$`);

module.exports = {
  commitMatcher,
  COMMIT_TYPES,
};
