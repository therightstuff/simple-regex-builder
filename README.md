# Simple Regex Builder

![](https://img.shields.io/badge/Coverage-99%25-83A603.svg?color=black&prefix=$coverage$)

A human-friendly regex builder.

## Installation

```sh
npm i simple-regex-builder
```

## Usage

### Importing

#### ES modules

```typescript
import { REGEX, SimpleRegexBuilder } from 'simple-regex-builder';
```

#### CommonJS modules

```javascript
const { REGEX, SimpleRegexBuilder} = require('simple-regex-builder');
```

### SimpleRegexBuilder

A SimpleRegexBuilder is a mutable builder object.

```javascript
const r = new SimpleRegexBuilder().global().ignoreCase();
r.startsWith('a')
    .add(REGEX.BETWEEN_N_AND_M(1, 3, REGEX.ANY_WHITESPACE))
    .endsWith('b');
console.log(r.toString());
// /^a\s{1,3}b$/gi
```

The regex object's sequence can be manipulated with the `startsWith`, `endsWith`, `add` and `followedBy`.

For convenience, the `add` and `followedBy` methods are synonymous.

`end` is the equivalent of `endsWith('')`.

The regex modifiers can be manipulated with `global`, `ignoreCase`, `multiline` and `unicode`, which all receive a boolean parameter that defaults to `true`.

*NOTE: The `sticky` modifier and `lastIndex` property of `RegExp` don't really make sense for a builder, if you need that functionality just `build` a `RegExp` object as described below and use that instead.*

To reuse a partially developed builder, provide it as the argument to a new object's constructor, or use the `clone` method directly:

```javascript
const base = new SimpleRegexBuilder().startsWith('abc');

const caseInsensitiveMatcher = new SimpleRegexBuilder(base).ignoreCase();
console.log(caseInsensitiveMatcher.toString());
// /^abc/i

const globalMatcher = base.clone().global();
console.log(globalMatcher.toString());
// /^abc/g
```

Building a `RegExp` object is done with either of the synonymous `build` or `toRegExp` methods:

```javascript
const r = new SimpleRegexBuilder().add("rain").build();
const s = new SimpleRegexBuilder().add("spain").toRegExp();
```

For convenience, the `RegExp` class's `exec`, `test` and `toString` methods can be called directly on the `SimpleRegexBuilder` itself:

```javascript
const r = new SimpleRegexBuilder().add("ain");
console.log(r.test('The rain in Spain falls mainly on the plain.'));
// true
console.log(r.exec('The rain in Spain falls mainly on the plain.'));
// [ 'ain', index: 5, input: 'The rain in Spain falls mainly on the plain.', groups: undefined ]
```

### REGEX

The `REGEX` object includes both constants and functions that accept strings, `RegExp` and `SimpleRegexBuilder` objects.

The `REGEX` object is a set of key/value pairs, where some of the values are strings and some of them functions.

```javascript
console.log(REGEX.ANY_CHARACTER);
// "."
console.log(REGEX.CHARACTERS_IN_SET("a-z0-9"));
// "[a-z0-9]"
```

#### Brackets

| Key | Value | Description |
| --- | ------ | ----------- |
| CHARACTERS_IN_SET | `("abc") => "[abc]"` | Find any character between the brackets |
| CHARACTERS_NOT_IN_SET | `("abc") => "[^abc]"` | Find any character NOT between the brackets |
| IN_SET | `("abc","d[ef]*") => "(abc\|d[ef]*)"` | Find any of the alternatives specified |

#### Metacharacters

| Key | Value | Description |
| --- | ------ | ----------- |
| ANY_CHARACTER or ANY | `.` | Find a single character, except newline or line terminator |
| WORD_CHARACTER or WORD | `\w` | Find any word character, equivalent to `[a-zA-Z_0-9]` |
| NON_WORD_CHARACTER or NON_WORD | `\W` | Find a non-word character, equivalent to `[^a-zA-Z_0-9]` |
| DIGIT | `\d` | Find a digit |
| NON_DIGIT | `\D` | Find a non-digit character |
| WHITESPACE | `\s` | Find a whitespace character |
| NON_WHITESPACE | `\S` | Find a non-whitespace character |
| MATCH_WORD_BEGINNING_WITH | `("word") => "\bword"` | Find a match at the beginning of a word |
| MATCH_WORD_ENDING_WITH | `("word") => "word\b"` | Find a match at the end of a word |
| MATCH_WORD_BEGINNING_AND_ENDING_WITH | `("word") => "\bword\b"` | Find a match for the whole word |
| MATCH_WORD_NOT_BEGINNING_WITH | `("word") => "\Bword"` | Find a match for the word, but not if it's at the beginning of a word |
| MATCH_WORD_NOT_ENDING_WITH | `("word") => "word\B"` | Find a match for the word, but not if it's at the end of a word |
| MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH | `("word") => "\Bword\B"` | Find a match for the word, but not if it's at the beginning or end of a word |
| NULL_CHARACTER or NULL | `\0` | Find a NULL character |
| NEW_LINE | `\n` | Find a new line character |
| FORM_FEED | `\f` | Find a form feed character |
| CARRIAGE_RETURN | `\r` | Find a carriage return character |
| TAB | `\t` | Find a tab character |
| VERTICAL_TAB | `\v` | Find a vertical tab character |
| OCTAL_NUMBER or OCT | `("17") => "\17"` | Find the character specified by the given octal number |
| HEXADECIMAL_NUMBER or HEX_NUMBER or HEX | `("1a") => "\x1a"` | Find the character specified by the given hexadecimal number |
| UNICODE_CHARACTER or UNICODE | `("1F1EE", "1F1F1") => "\u{1F1EE}\u{1F1F1}"` | Find the Unicode character specified by a given hexadecimal number / numbers<br>*WARNING: the unicode modifier must be provided in order for this to match* |

#### Quantifiers

Quantifier methods accept regex in the form of strings, `RegExp` objects and `SimpleRegexBuilder` objects.

If the length of the given argument is greater than 1 then it will be enclosed in brackets, eg. `("n") => "n*"` but `("abc") => "(abc)*"`.

| Key | Value | Description |
| --- | ------ | ----------- |
| ONE_OR_MORE or AT_LEAST_ONE | `("n") => "n+"`, | Matches any string that contains at least one n |
| ZERO_OR_MORE | `("n") => "n*"` | Matches any string that contains zero or more occurrences of n |
| ZERO_OR_ONE or OPTIONAL | `("n") => "n?"` | Matches any string that contains zero or one occurrences of n |
| EXACTLY_X or EXACTLY_N or EXACTLY | `(2, "n") => "n{3}"` | Matches any string that contains a sequence of X n's |
| BETWEEN_X_AND_Y or BETWEEN_N_AND_M or BETWEEN | `(1, 3, "n") => "n{1,3}"` | Matches any string that contains a sequence of X to Y n's |
| AT_LEAST_X or AT_LEAST_N or AT_LEAST | `(1, "n") => "n{1,}"` | Matches any string that contains a sequence of at least X n's |
| IS_FOLLOWED_BY or FOLLOWED_BY | `("\s+term") => "(?=\s+term)"` | Matches any string that is followed by a specific string n |
| IS_NOT_FOLLOWED_BY or NOT_FOLLOWED_BY | `("\s+term") => "(?!\s+term)"` | Matches any string that is followed by a specific string n |

## License

[MIT](./LICENSE)

## ALL CONTRIBUTIONS AND FEEDBACK WELCOME
