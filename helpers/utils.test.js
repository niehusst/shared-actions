const test = require('ava');
const { commitMatcher } = require('./utils');

test('sentence not matched', (t) => {
  const res = 'not even a real commit smh'.match(commitMatcher);
  t.is(res, null);
});

test('basic commit style matched', (t) => {
  const res = 'test: passing'.match(commitMatcher);
  t.assert(res);
});

test('commit type extracted correctly', (t) => {
  const res = 'feat(ticket): did a thing'.match(commitMatcher);
  t.is(res.groups.type, 'feat');
});

test('commit breaking extracted correctly', (t) => {
  let res = 'fix!: everything is different'.match(commitMatcher);
  t.assert(res.groups.breaking);
  res = 'ci: didnt break anything'.match(commitMatcher);
  t.assert(!res.groups.breaking);
});
