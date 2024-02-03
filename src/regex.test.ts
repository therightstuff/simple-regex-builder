import { REGEX } from './regex';
import { SimpleRegexBuilder } from './simple-regex-builder';

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
