import { SimpleRegexBuilder } from './simple-regex-builder';

export const REGEX = {
    ANY_CHARACTER: '.',
    ANY_DIGIT: '\\d',
    ANY_LETTER: '\\w',
    ANY_WHITESPACE: '\\s',
    ANY_CHARACTER_IN_SET: (characters: string) => `[${characters}]`,
    ANY_CHARACTER_NOT_IN_SET: (characters: string) => `[^${characters}]`,
    ZERO_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => {
        if (typeof regex === "string" && regex.length === 1) {
            return `${regex}*`;
        }
        if (regex instanceof RegExp) {
            return `(${regex.source})*`;
        }
        if (regex instanceof SimpleRegexBuilder) {
            return `(${regex.toRegExp().source})*`;
        }
        return `(${regex})*`;
    },
    ONE_OR_MORE: (regex: string | SimpleRegexBuilder) => `${regex}+`,
    OPTIONAL: (regex: string | SimpleRegexBuilder) => `${regex}?`,
    ZERO_OR_ONE: (regex: string | SimpleRegexBuilder) => `${regex}?`,
    EXACTLY_N: (n: number, regex: string | SimpleRegexBuilder) => `${regex}{${n}}`,
    AT_LEAST_N: (n: number, regex: string | SimpleRegexBuilder) => `${regex}{${n},}`,
    BETWEEN_N_AND_M: (n: number, m: number, regex: string | SimpleRegexBuilder) => `${regex}{${n},${m}}`,
    OR: '|',
    GROUP: (group: string | SimpleRegexBuilder) => `(${group.toString()})`,
};
