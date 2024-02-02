import { SimpleRegexBuilder } from './simple-regex-builder';

const generateHex = (code: string) => {
    if (code.startsWith('\\x')) {
        return code;
    }
    return `\\x${code}`;
}

const generateOctal = (code: string) => {
    if (code.startsWith('\\')) {
        return code;
    }
    return `\\${code}`;
}

const generateUnicode = (code: string) => {
    if (code.startsWith('\\u')) {
        return code;
    }
    if (code.startsWith('U+')) {
        return `\\u${code.substring(2)}`;
    }
    return `\\u${code}`;
}

const regexToStr = (regex: string | RegExp | SimpleRegexBuilder) => {
    let regexString = regex instanceof RegExp ? regex.source : regex instanceof SimpleRegexBuilder ? regex.toRegExp().source : regex;
    // if it's a group already, don't wrap it in another group
    if (regexString.startsWith('(') && regexString.endsWith(')')) {
        return regexString;
    }
    return regexString.length > 1 ? `(${regexString})` : regexString;
}

const BRACKETS = {
    CHARACTERS_IN_SET: (characters: string) => `[${characters}]`,
    CHARACTERS_NOT_IN_SET: (characters: string) => `[^${characters}]`,
    STRINGS_IN_SET: (...strings: string[]) => `(${strings.join('|')})`,
};

const METACHARACTERS = {
    ANY_CHARACTER: '.',
    ANY: '.',
    WORD_CHARACTER: '\\w',
    WORD: '\\w',
    NON_WORD_CHARACTER: '\\W',
    NON_WORD: '\\W',
    DIGIT: '\\d',
    NON_DIGIT: '\\D',
    WHITESPACE: '\\s',
    NON_WHITESPACE: '\\S',
    MATCH_WORD_BEGINNING_WITH: (word: string) => `\\b${word}`,
    MATCH_WORD_ENDING_WITH: (word: string) => `${word}\\b`,
    MATCH_WORD_BEGINNING_AND_ENDING_WITH: (word: string) => `\\b${word}\\b`,
    MATCH_WORD_NOT_BEGINNING_WITH: (word: string) => `\\B${word}`,
    MATCH_WORD_NOT_ENDING_WITH: (word: string) => `${word}\\B`,
    MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH: (word: string) => `\\B${word}\\B`,
    NULL_CHARACTER: '\\0',
    NULL: '\\0',
    NEW_LINE: '\\n',
    FORM_FEED: '\\f',
    CARRIAGE_RETURN: '\\r',
    TAB: '\\t',
    VERTICAL_TAB: '\\v',
    OCTAL_NUMBER: generateOctal,
    OCT: generateOctal,
    HEXADECIMAL_NUMBER: generateHex,
    HEX_NUMBER: generateHex,
    HEX: generateHex,
    UNICODE_CHARACTER: generateUnicode,
    UNICODE: generateUnicode,
}

const QUANTIFIERS = {
    AT_LEAST_N: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},}`,
    BETWEEN_N_AND_M: (n: number, m: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},${m}}`,
    EXACTLY_N: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n}}`,
    GROUP: (regex: string | RegExp | SimpleRegexBuilder) => `(${regexToStr(regex)})`,
    ONE_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}+`,
    OPTIONAL: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}?`,
    OR: '|',
    ZERO_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}*`,
    ZERO_OR_ONE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}?`,
};

export const REGEX = {
    ...BRACKETS,
    ...METACHARACTERS,
    ...QUANTIFIERS,
};
