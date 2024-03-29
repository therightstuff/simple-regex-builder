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

const generateSingleUnicode = (code: string) => {
    if (code.startsWith('\\u')) {
        return code;
    }
    if (code.startsWith('U+')) {
        return `\\u${code.substring(2)}`;
    }
    return `\\u${code}`;
}

const generateUnicode = (...codes: string[]) => {
    return codes.map((code) => generateSingleUnicode(code)).join('');
}

const USE_BRACKET_WRAPPING = true;
const NO_BRACKET_WRAPPING = false;

const regexToStr = (regex: string | RegExp | SimpleRegexBuilder, useBracketWrapping: boolean = USE_BRACKET_WRAPPING) => {
    let regexString = regex instanceof RegExp ? regex.source : regex instanceof SimpleRegexBuilder ? regex.toRegExp().source : regex;
    // if it's a group already, don't wrap it in another group
    if (regexString.startsWith('(') && regexString.endsWith(')')) {
        return regexString;
    }
    if (regexString.startsWith('[') && regexString.endsWith(']')) {
        return regexString;
    }
    return useBracketWrapping && regexString.length > 1 ? `(${regexString})` : regexString;
}

const BRACKETS = {
    // | CHARACTERS_IN_SET | `("abc") => "[abc]"` | Find any character between the brackets |
    CHARACTERS_IN_SET: (characters: string) => `[${characters}]`,
    // | CHARACTERS_NOT_IN_SET | `("abc") => "[^abc]"` | Find any character NOT between the brackets |
    CHARACTERS_NOT_IN_SET: (characters: string) => `[^${characters}]`,
    // | IN_SET | `("abc","d[ef]*") => "(abc\|d[ef]*)"` | Find any of the alternatives specified |
    IN_SET: (...alternatives: any[]) => `(${alternatives.map((regex) => regexToStr(regex, NO_BRACKET_WRAPPING)).join('|')})`,
};

const METACHARACTERS = {
    // | ANY_CHARACTER or ANY | `.` | Find a single character, except newline or line terminator |
    ANY_CHARACTER: '.',
    ANY: '.',
    // | WORD_CHARACTER or WORD | `\w` | Find any word character, equivalent to `[a-zA-Z_0-9]` |
    WORD_CHARACTER: '\\w',
    WORD: '\\w',
    // | NON_WORD_CHARACTER or NON_WORD | `\W` | Find a non-word character, equivalent to `[^a-zA-Z_0-9]` |
    NON_WORD_CHARACTER: '\\W',
    NON_WORD: '\\W',
    // | DIGIT | `\d` | Find a digit |
    DIGIT: '\\d',
    // | NON_DIGIT | `\D` | Find a non-digit character |
    NON_DIGIT: '\\D',
    // | WHITESPACE | `\s` | Find a whitespace character |
    WHITESPACE: '\\s',
    // | NON_WHITESPACE | `\S` | Find a non-whitespace character |
    NON_WHITESPACE: '\\S',
    // | MATCH_WORD_BEGINNING_WITH | `("word") => "\bword"` | Find a match at the beginning of a word |
    MATCH_WORD_BEGINNING_WITH: (word: string) => `\\b${word}`,
    // | MATCH_WORD_ENDING_WITH | `("word") => "word\b"` | Find a match at the end of a word |
    MATCH_WORD_ENDING_WITH: (word: string) => `${word}\\b`,
    // | MATCH_WORD_BEGINNING_AND_ENDING_WITH | `("word") => "\bword\b"` | Find a match for the whole word |
    MATCH_WORD_BEGINNING_AND_ENDING_WITH: (word: string) => `\\b${word}\\b`,
    // | MATCH_WORD_NOT_BEGINNING_WITH | `("word") => "\Bword"` | Find a match for the word, but not if it's at the beginning of a word |
    MATCH_WORD_NOT_BEGINNING_WITH: (word: string) => `\\B${word}`,
    // | MATCH_WORD_NOT_ENDING_WITH | `("word") => "word\B"` | Find a match for the word, but not if it's at the end of a word |
    MATCH_WORD_NOT_ENDING_WITH: (word: string) => `${word}\\B`,
    // | MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH | `("word") => "\Bword\B"` | Find a match for the word, but not if it's at the beginning or end of a word |
    MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH: (word: string) => `\\B${word}\\B`,
    // | NULL_CHARACTER or NULL | `\0` | Find a NULL character |
    NULL_CHARACTER: '\\0',
    NULL: '\\0',
    // | NEW_LINE | `\n` | Find a new line character |
    NEW_LINE: '\\n',
    // | FORM_FEED | `\f` | Find a form feed character |
    FORM_FEED: '\\f',
    // | CARRIAGE_RETURN | `\r` | Find a carriage return character |
    CARRIAGE_RETURN: '\\r',
    // | TAB | `\t` | Find a tab character |
    TAB: '\\t',
    // | VERTICAL_TAB | `\v` | Find a vertical tab character |
    VERTICAL_TAB: '\\v',
    // | OCTAL_NUMBER or OCT | `("17") => "\17"` | Find the character specified by the given octal number |
    OCTAL_NUMBER: generateOctal,
    OCT: generateOctal,
    // | HEXADECIMAL_NUMBER or HEX_NUMBER or HEX | `("1a") => "\x1a"` | Find the character specified by the given hexadecimal number |
    HEXADECIMAL_NUMBER: generateHex,
    HEX_NUMBER: generateHex,
    HEX: generateHex,
    // | UNICODE_CHARACTER or UNICODE | `("1F1EE", "1F1F1") => "\u{1F1EE}\u{1F1F1}"` | Find the Unicode character specified by a given hexadecimal number / numbers<br>*WARNING: the unicode modifier must be provided in order for this to match* |
    UNICODE_CHARACTER: generateUnicode,
    UNICODE: generateUnicode,
}

const QUANTIFIERS = {
    // | ONE_OR_MORE or AT_LEAST_ONE | `("n") => "n+"`, | Matches any string that contains at least one n |
    ONE_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}+`,
    // | ZERO_OR_MORE | `("n") => "n*"` | Matches any string that contains zero or more occurrences of n |
    ZERO_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}*`,
    // | ZERO_OR_ONE or OPTIONAL | `("n") => "n?"` | Matches any string that contains zero or one occurrences of n |
    ZERO_OR_ONE: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}?`,
    OPTIONAL: (regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}?`,
    // | EXACTLY_X or EXACTLY_N or EXACTLY | `(2, "n") => "n{3}"` | Matches any string that contains a sequence of X n's |
    EXACTLY_X: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n}}`,
    EXACTLY_N: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n}}`,
    EXACTLY: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n}}`,
    // | BETWEEN_X_AND_Y or BETWEEN_N_AND_M or BETWEEN: `(1, 3, "n") => "n{1,3}"` | Matches any string that contains a sequence of X to Y n's |
    BETWEEN_X_AND_Y: (x: number, y: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${x},${y}}`,
    BETWEEN_N_AND_M: (n: number, m: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},${m}}`,
    BETWEEN: (n: number, m: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},${m}}`,
    // | AT_LEAST_X or AT_LEAST_N or AT_LEAST | `(1, "n") => "n{1,}"` | Matches any string that contains a sequence of at least X n's |
    AT_LEAST_X: (x: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${x},}`,
    AT_LEAST_N: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},}`,
    AT_LEAST: (n: number, regex: string | RegExp | SimpleRegexBuilder) => `${regexToStr(regex)}{${n},}`,
    // | IS_FOLLOWED_BY or FOLLOWED_BY | `("\s+term") => "(?=\s+term)"` | Matches any string that is followed by a specific string n |
    IS_FOLLOWED_BY: (regex: string | RegExp | SimpleRegexBuilder) => `(?=${regexToStr(regex, NO_BRACKET_WRAPPING)})`,
    FOLLOWED_BY: (regex: string | RegExp | SimpleRegexBuilder) => `(?=${regexToStr(regex, NO_BRACKET_WRAPPING)})`,
    // | IS_NOT_FOLLOWED_BY or NOT_FOLLOWED_BY | `("\s+term") => "(?!\s+term)"` | Matches any string that is followed by a specific string n |
    IS_NOT_FOLLOWED_BY: (regex: string | RegExp | SimpleRegexBuilder) => `(?!${regexToStr(regex, NO_BRACKET_WRAPPING)})`,
    NOT_FOLLOWED_BY: (regex: string | RegExp | SimpleRegexBuilder) => `(?!${regexToStr(regex, NO_BRACKET_WRAPPING)})`,
};

export const REGEX = {
    ...BRACKETS,
    ...METACHARACTERS,
    ...QUANTIFIERS,
};
