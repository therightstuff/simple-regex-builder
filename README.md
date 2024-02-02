# Simple Regex Builder

A human-friendly regex builder.

## Installation

```sh
npm i simple-regex-builder
```

## Usage

### Importing

ES modules:

```typescript
import { REGEX, SimpleRegexBuilder } from 'simple-regex-builder';
```

CommonJS modules:

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

For convenience, the `add` and `followedBy` methods are synonymous.

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

For convenience, the `RegExp` class's `exec`, `test` and `toString` methods can be called directly on the `SimpleRegexBuilder` itself.

```javascript
const r = new SimpleRegexBuilder().add("ain");
console.log(r.test('The rain in Spain falls mainly on the plain.'));
// true
console.log(r.exec('The rain in Spain falls mainly on the plain.'));
// [ 'ain', index: 5, input: 'The rain in Spain falls mainly on the plain.', groups: undefined ]
```

### REGEX

### Examples

```javascript
console.log(new SimpleRegexBuilder().startsWith('a').endsWith('b').toString());
// ^ab$

console.log(REGEX.ONE_OR_MORE('a'));
// a+
```

## License

[MIT](./LICENSE)

## ALL CONTRIBUTIONS AND FEEDBACK WELCOME
