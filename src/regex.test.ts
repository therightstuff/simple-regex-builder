
import { REGEX } from './regex';
import { SimpleRegexBuilder } from './simple-regex-builder';

describe('REGEX brackets', () => {
    describe('CHARACTERS_IN_SET', () => {
        test('char', () => {
            expect(REGEX.CHARACTERS_IN_SET('t')).toBe('[t]');
        });

        test('string', () => {
            expect(REGEX.CHARACTERS_IN_SET('test')).toBe('[test]');
        });
    });

    describe('CHARACTERS_NOT_IN_SET', () => {
        test('char', () => {
            expect(REGEX.CHARACTERS_NOT_IN_SET('t')).toBe('[^t]');
        });

        test('string', () => {
            expect(REGEX.CHARACTERS_NOT_IN_SET('test')).toBe('[^test]');
        });
    });

    describe('IN_SET', () => {
        test('single', () => {
            expect(REGEX.IN_SET('test')).toBe('(test)');
        });

        test('multiple', () => {
            expect(REGEX.IN_SET('test', new RegExp('test2'), new SimpleRegexBuilder('test3'))).toBe('(test|test2|test3)');
        });
    });
});

describe('REGEX metacharacters', () => {
    test('ANY_CHARACTER ANY', () => {
        expect(REGEX.ANY_CHARACTER).toBe('.');
        expect(REGEX.ANY).toBe('.');
    });

    test('WORD_CHARACTER WORD', () => {
        expect(REGEX.WORD_CHARACTER).toBe('\\w');
        expect(REGEX.WORD).toBe('\\w');
    });

    test('NON_WORD_CHARACTER NON_WORD', () => {
        expect(REGEX.NON_WORD_CHARACTER).toBe('\\W');
        expect(REGEX.NON_WORD).toBe('\\W');
    });

    test('DIGIT', () => {
        expect(REGEX.DIGIT).toBe('\\d');
    });

    test('NON_DIGIT', () => {
        expect(REGEX.NON_DIGIT).toBe('\\D');
    });

    test('WHITESPACE', () => {
        expect(REGEX.WHITESPACE).toBe('\\s');
    });

    test('NON_WHITESPACE', () => {
        expect(REGEX.NON_WHITESPACE).toBe('\\S');
    });

    test('MATCH_WORD_BEGINNING_WITH', () => {
        expect(REGEX.MATCH_WORD_BEGINNING_WITH('word')).toBe('\\bword');
    });

    test('MATCH_WORD_NOT_BEGINNING_WITH', () => {
        expect(REGEX.MATCH_WORD_NOT_BEGINNING_WITH('word')).toBe('\\Bword');
    });

    test('MATCH_WORD_ENDING_WITH', () => {
        expect(REGEX.MATCH_WORD_ENDING_WITH('word')).toBe('word\\b');
    });

    test('MATCH_WORD_NOT_ENDING_WITH', () => {
        expect(REGEX.MATCH_WORD_NOT_ENDING_WITH('word')).toBe('word\\B');
    });

    test('MATCH_WORD_BEGINNING_AND_ENDING_WITH', () => {
        expect(REGEX.MATCH_WORD_BEGINNING_AND_ENDING_WITH('word')).toBe('\\bword\\b');
    });

    test('MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH', () => {
        expect(REGEX.MATCH_WORD_NOT_BEGINNING_OR_ENDING_WITH('word')).toBe('\\Bword\\B');
    });

    test('NULL_CHARACTER NULL', () => {
        expect(REGEX.NULL_CHARACTER).toBe('\\0');
        expect(REGEX.NULL).toBe('\\0');
    });

    test('NEW_LINE', () => {
        expect(REGEX.NEW_LINE).toBe('\\n');
    });

    test('FORM_FEED', () => {
        expect(REGEX.FORM_FEED).toBe('\\f');
    });

    test('CARRIAGE_RETURN', () => {
        expect(REGEX.CARRIAGE_RETURN).toBe('\\r');
    });

    test('TAB', () => {
        expect(REGEX.TAB).toBe('\\t');
    });

    test('VERTICAL_TAB', () => {
        expect(REGEX.VERTICAL_TAB).toBe('\\v');
    });

    test('OCTAL_NUMBER OCT', () => {
        expect(REGEX.OCTAL_NUMBER('17')).toBe('\\17');
        expect(REGEX.OCTAL_NUMBER('\\17')).toBe('\\17');
        expect(REGEX.OCT('17')).toBe('\\17');
        expect(REGEX.OCT('\\17')).toBe('\\17');
    });

    test('HEXADECIMAL_NUMBER HEX', () => {
        expect(REGEX.HEXADECIMAL_NUMBER('1a')).toBe('\\x1a');
        expect(REGEX.HEXADECIMAL_NUMBER('\\x1a')).toBe('\\x1a');
        expect(REGEX.HEX_NUMBER('1a')).toBe('\\x1a');
        expect(REGEX.HEX_NUMBER('\\x1a')).toBe('\\x1a');
    });

    describe("UNICODE_CHARACTER UNICODE", () => {
        test.each([
            ['UNICODE_CHARACTER', ''],
            ['UNICODE_CHARACTER', '\\u'],
            ['UNICODE_CHARACTER', 'U+'],
            ['UNICODE', ''],
            ['UNICODE', '\\u'],
            ['UNICODE', 'U+'],
        ])(`'%s' with prefix '%s'`, (func, prefix) => {
            expect(REGEX[func](`${prefix}1a`)).toBe('\\u1a');

            expect(REGEX[func](`${prefix}1F1EE`, `${prefix}1F1F1`)).toBe('\\u1F1EE\\u1F1F1');
            expect(REGEX[func](`${prefix}1F1EE`, `${prefix}1F1F1`)).toBe('\\u1F1EE\\u1F1F1');
        });
    });
});

describe('REGEX quantifiers', () => {
    describe('ONE_OR_MORE', () => {
        describe('char', () => {
            test('char', () => {
                expect(REGEX.ONE_OR_MORE('t')).toBe('t+');
            });
        });

        describe('string', () => {
            test.each([
                ['test', '(test)+'],
                ['[abc]', '[abc]+'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ONE_OR_MORE(val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                [new RegExp('test'), '(test)+'],
                [new RegExp('[abc]'), '[abc]+'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ONE_OR_MORE(val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                [new SimpleRegexBuilder().add('test'), '(test)+'],
                [new SimpleRegexBuilder().add('[abc]'), '[abc]+'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ONE_OR_MORE(val)).toBe(expected);
            });
        });
    });

    describe('ZERO_OR_MORE', () => {
        describe('char', () => {
            test('char', () => {
                expect(REGEX.ZERO_OR_MORE('t')).toBe('t*');
            });
        });

        describe('string', () => {
            test.each([
                ['test', '(test)*'],
                ['[abc]', '[abc]*'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_MORE(val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                [new RegExp('test'), '(test)*'],
                [new RegExp('[abc]'), '[abc]*'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_MORE(val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                [new SimpleRegexBuilder().add('test'), '(test)*'],
                [new SimpleRegexBuilder().add('[abc]'), '[abc]*'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_MORE(val)).toBe(expected);
            });
        });
    });

    describe('ZERO_OR_ONE', () => {
        describe('char', () => {
            test('char', () => {
                expect(REGEX.ZERO_OR_ONE('t')).toBe('t?');
            });
        });

        describe('string', () => {
            test.each([
                ['test', '(test)?'],
                ['[abc]', '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_ONE(val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                [new RegExp('test'), '(test)?'],
                [new RegExp('[abc]'), '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_ONE(val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                [new SimpleRegexBuilder().add('test'), '(test)?'],
                [new SimpleRegexBuilder().add('[abc]'), '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.ZERO_OR_ONE(val)).toBe(expected);
            });
        });
    });

    describe('OPTIONAL', () => {
        describe('char', () => {
            test('char', () => {
                expect(REGEX.OPTIONAL('t')).toBe('t?');
            });
        });

        describe('string', () => {
            test.each([
                ['test', '(test)?'],
                ['[abc]', '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.OPTIONAL(val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                [new RegExp('test'), '(test)?'],
                [new RegExp('[abc]'), '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.OPTIONAL(val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                [new SimpleRegexBuilder().add('test'), '(test)?'],
                [new SimpleRegexBuilder().add('[abc]'), '[abc]?'],
            ])(`'%s' with '%s'`, (val, expected) => {
                expect(REGEX.OPTIONAL(val)).toBe(expected);
            });
        });
    });

    describe('EXACTLY_X EXACTLY_N EXACTLY', () => {
        describe('char', () => {
            test.each([
                ['EXACTLY_X'],
                ['EXACTLY_N'],
                ['EXACTLY'],
            ])(`'%s'`, (func) => {
                expect(REGEX[func](3, 't')).toBe('t{3}');
            });
        });

        describe('string', () => {
            test.each([
                ['EXACTLY_X', 'test', '(test){3}'],
                ['EXACTLY_N', 'test', '(test){3}'],
                ['EXACTLY', 'test', '(test){3}'],
                ['EXACTLY_X', '[abc]', '[abc]{3}'],
                ['EXACTLY_N', '[abc]', '[abc]{3}'],
                ['EXACTLY', '[abc]', '[abc]{3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](3, val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                ['EXACTLY_X', new RegExp('test'), '(test){3}'],
                ['EXACTLY_N', new RegExp('test'), '(test){3}'],
                ['EXACTLY', new RegExp('test'), '(test){3}'],
                ['EXACTLY_X', new RegExp('[abc]'), '[abc]{3}'],
                ['EXACTLY_N', new RegExp('[abc]'), '[abc]{3}'],
                ['EXACTLY', new RegExp('[abc]'), '[abc]{3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](3, val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                ['EXACTLY_X', new SimpleRegexBuilder().add('test'), '(test){3}'],
                ['EXACTLY_N', new SimpleRegexBuilder().add('test'), '(test){3}'],
                ['EXACTLY', new SimpleRegexBuilder().add('test'), '(test){3}'],
                ['EXACTLY_X', new SimpleRegexBuilder().add('[abc]'), '[abc]{3}'],
                ['EXACTLY_N', new SimpleRegexBuilder().add('[abc]'), '[abc]{3}'],
                ['EXACTLY', new SimpleRegexBuilder().add('[abc]'), '[abc]{3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](3, val)).toBe(expected);
            });
        });
    });

    describe('BETWEEN_X_AND_Y BETWEEN_N_AND_M BETWEEN', () => {
        describe('char', () => {
            test.each([
                ['BETWEEN_X_AND_Y'],
                ['BETWEEN_N_AND_M'],
                ['BETWEEN'],
            ])(`'%s'`, (func) => {
                expect(REGEX[func](1, 3, 't')).toBe('t{1,3}');
            });
        });

        describe('string', () => {
            test.each([
                ['BETWEEN_X_AND_Y', 'test', '(test){1,3}'],
                ['BETWEEN_N_AND_M', 'test', '(test){1,3}'],
                ['BETWEEN', 'test', '(test){1,3}'],
                ['BETWEEN_X_AND_Y', '[abc]', '[abc]{1,3}'],
                ['BETWEEN_N_AND_M', '[abc]', '[abc]{1,3}'],
                ['BETWEEN', '[abc]', '[abc]{1,3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, 3, val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                ['BETWEEN_X_AND_Y', new RegExp('test'), '(test){1,3}'],
                ['BETWEEN_N_AND_M', new RegExp('test'), '(test){1,3}'],
                ['BETWEEN', new RegExp('test'), '(test){1,3}'],
                ['BETWEEN_X_AND_Y', new RegExp('[abc]'), '[abc]{1,3}'],
                ['BETWEEN_N_AND_M', new RegExp('[abc]'), '[abc]{1,3}'],
                ['BETWEEN', new RegExp('[abc]'), '[abc]{1,3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, 3, val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                ['BETWEEN_X_AND_Y', new SimpleRegexBuilder().add('test'), '(test){1,3}'],
                ['BETWEEN_N_AND_M', new SimpleRegexBuilder().add('test'), '(test){1,3}'],
                ['BETWEEN', new SimpleRegexBuilder().add('test'), '(test){1,3}'],
                ['BETWEEN_X_AND_Y', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,3}'],
                ['BETWEEN_N_AND_M', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,3}'],
                ['BETWEEN', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,3}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, 3, val)).toBe(expected);
            });
        });
    });

    describe('AT_LEAST_X AT_LEAST_N AT_LEAST', () => {
        describe('char', () => {
            test.each([
                ['AT_LEAST_X'],
                ['AT_LEAST_N'],
                ['AT_LEAST'],
            ])(`'%s'`, (func) => {
                expect(REGEX[func](1, 't')).toBe('t{1,}');
            });
        });

        describe('string', () => {
            test.each([
                ['AT_LEAST_X', 'test', '(test){1,}'],
                ['AT_LEAST_N', 'test', '(test){1,}'],
                ['AT_LEAST', 'test', '(test){1,}'],
                ['AT_LEAST_X', '[abc]', '[abc]{1,}'],
                ['AT_LEAST_N', '[abc]', '[abc]{1,}'],
                ['AT_LEAST', '[abc]', '[abc]{1,}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                ['AT_LEAST_X', new RegExp('test'), '(test){1,}'],
                ['AT_LEAST_N', new RegExp('test'), '(test){1,}'],
                ['AT_LEAST', new RegExp('test'), '(test){1,}'],
                ['AT_LEAST_X', new RegExp('[abc]'), '[abc]{1,}'],
                ['AT_LEAST_N', new RegExp('[abc]'), '[abc]{1,}'],
                ['AT_LEAST', new RegExp('[abc]'), '[abc]{1,}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                ['AT_LEAST_X', new SimpleRegexBuilder().add('test'), '(test){1,}'],
                ['AT_LEAST_N', new SimpleRegexBuilder().add('test'), '(test){1,}'],
                ['AT_LEAST', new SimpleRegexBuilder().add('test'), '(test){1,}'],
                ['AT_LEAST_X', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,}'],
                ['AT_LEAST_N', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,}'],
                ['AT_LEAST', new SimpleRegexBuilder().add('[abc]'), '[abc]{1,}'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](1, val)).toBe(expected);
            });
        });
    });

    describe('IS_FOLLOWED_BY FOLLOWED_BY', () => {
        describe('char', () => {
            test.each([
                ['IS_FOLLOWED_BY'],
                ['FOLLOWED_BY'],
            ])(`'%s'`, (func) => {
                expect(REGEX[func]('t')).toBe('(?=t)');
            });
        });

        describe('string', () => {
            test.each([
                ['IS_FOLLOWED_BY', 'test', '(?=test)'],
                ['FOLLOWED_BY', 'test', '(?=test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                ['IS_FOLLOWED_BY', new RegExp('test'), '(?=test)'],
                ['FOLLOWED_BY', new RegExp('test'), '(?=test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                ['IS_FOLLOWED_BY', new SimpleRegexBuilder().add('test'), '(?=test)'],
                ['FOLLOWED_BY', new SimpleRegexBuilder().add('test'), '(?=test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });
    });

    describe('IS_NOT_FOLLOWED_BY NOT_FOLLOWED_BY', () => {
        describe('char', () => {
            test.each([
                ['IS_NOT_FOLLOWED_BY'],
                ['NOT_FOLLOWED_BY'],
            ])(`'%s'`, (func) => {
                expect(REGEX[func]('t')).toBe('(?!t)');
            });
        });

        describe('string', () => {
            test.each([
                ['IS_NOT_FOLLOWED_BY', 'test', '(?!test)'],
                ['NOT_FOLLOWED_BY', 'test', '(?!test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });

        describe('RegExp', () => {
            test.each([
                ['IS_NOT_FOLLOWED_BY', new RegExp('test'), '(?!test)'],
                ['NOT_FOLLOWED_BY', new RegExp('test'), '(?!test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });

        describe('SimpleRegexBuilder', () => {
            test.each([
                ['IS_NOT_FOLLOWED_BY', new SimpleRegexBuilder().add('test'), '(?!test)'],
                ['NOT_FOLLOWED_BY', new SimpleRegexBuilder().add('test'), '(?!test)'],
            ])(`'%s' with '%s'`, (func, val, expected) => {
                expect(REGEX[func](val)).toBe(expected);
            });
        });
    });
});
