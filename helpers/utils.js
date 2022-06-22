const commitMatcher = /^(?<type>fix|feat|build|chore|ci|docs|style|refactor|perf|test)(\([^)]+\))?(?<breaking>!)?:.*$/m;

module.exports = {
    commitMatcher,
};
