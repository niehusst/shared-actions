const test = require('ava');
const {
  commitMatcher,
  optionalInput,
  optionalBooleanInput,
} = require('./utils');

// COMMIT MATCHING TESTS

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

// optionalInput TESTS

test('optionalInput empty string outputs null', (t) => {
  const res = optionalInput('');
  t.is(res, null);
});

test('optionalInput non-empty string outputs original input', (t) => {
  const res = optionalInput('something');
  t.is(res, 'something');
});

// optionalBooleanInput TESTS

test('optionalBooleanInput empty string outputs null', (t) => {
  const res = optionalBooleanInput('');
  t.is(res, null);
});

test('optionalBooleanInput string converts to bool', (t) => {
  t.assert(optionalBooleanInput('true'));
  t.assert(!optionalBooleanInput('false'));
});
