# Simple Regex Builder

A human-friendly regex builder.

## Usage

```javascript
const { REGEX, SimpleRegexBuilder} = require('simple-regex-builder');

console.log(new SimpleRegexBuilder().startsWith('a').endsWith('b').toString());
// ^ab$

console.log(REGEX.ONE_OR_MORE('a'));
// a+
```

## License

[MIT](./LICENSE)
