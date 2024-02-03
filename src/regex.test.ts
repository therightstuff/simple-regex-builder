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

describe('REGEX.ZERO_OR_MORE', () => {
    test('char', () => {
        expect(REGEX.ZERO_OR_MORE('t')).toBe('t*');
    });

    test('string', () => {
        expect(REGEX.ZERO_OR_MORE('test')).toBe('(test)*');
    });

    test('RegExp', () => {
        expect(REGEX.ZERO_OR_MORE(new RegExp('test'))).toBe('(test)*');
    });

    test('SimpleRegexBuilder', () => {
        expect(REGEX.ZERO_OR_MORE(new SimpleRegexBuilder().add('test'))).toBe('(test)*');
    });
});
