"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX = void 0;
const simple_regex_builder_1 = require("./simple-regex-builder");
exports.REGEX = {
    ANY_CHARACTER: '.',
    ANY_DIGIT: '\\d',
    ANY_LETTER: '\\w',
    ANY_WHITESPACE: '\\s',
    ANY_CHARACTER_IN_SET: (characters) => `[${characters}]`,
    ANY_CHARACTER_NOT_IN_SET: (characters) => `[^${characters}]`,
    ZERO_OR_MORE: (regex) => {
        if (typeof regex === "string" && regex.length === 1) {
            return `${regex}*`;
        }
        if (regex instanceof RegExp) {
            return `(${regex.source})*`;
        }
        if (regex instanceof simple_regex_builder_1.SimpleRegexBuilder) {
            return `(${regex.toRegExp().source})*`;
        }
        return `(${regex})*`;
    },
    ONE_OR_MORE: (regex) => `${regex}+`,
    OPTIONAL: (regex) => `${regex}?`,
    ZERO_OR_ONE: (regex) => `${regex}?`,
    EXACTLY_N: (n, regex) => `${regex}{${n}}`,
    AT_LEAST_N: (n, regex) => `${regex}{${n},}`,
    BETWEEN_N_AND_M: (n, m, regex) => `${regex}{${n},${m}}`,
    OR: '|',
    GROUP: (group) => `(${group.toString()})`,
};
