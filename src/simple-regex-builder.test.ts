import { REGEX } from './regex';
import { SimpleRegexBuilder } from './simple-regex-builder';

describe('SimpleRegexBuilder construction', () => {
    test('simple', () => {
        const builder = new SimpleRegexBuilder();
        builder.startsWith('test');
        expect(builder.toString()).toBe('/^test/');
    });

    test('RegExp', () => {
        const builder = new SimpleRegexBuilder(new RegExp('test', 'g'));
        expect(builder.toString()).toBe('/test/g');
    });

    test('SimpleRegexBuilder', () => {
        const builder = new SimpleRegexBuilder(new SimpleRegexBuilder().startsWith('test'));
        expect(builder.toString()).toBe('/^test/');
    });
});

describe('SimpleRegexBuilder clone', () => {
    test('constructor', () => {
        const base = new SimpleRegexBuilder().startsWith('abc');

        const caseInsensitiveMatcher = new SimpleRegexBuilder(base).ignoreCase();
        expect(caseInsensitiveMatcher.toString()).toBe('/^abc/i');
        expect(base.toString()).toBe('/^abc/');
    });

    test('clone method', () => {
        const base = new SimpleRegexBuilder().startsWith('abc');

        const globalMatcher = base.clone().global();
        expect(globalMatcher.toString()).toBe('/^abc/g');
        expect(base.toString()).toBe('/^abc/');
    });
});

describe('SimpleRegexBuilder chaining', () => {
    test('followedBy', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').add(REGEX.ONE_OR_MORE(REGEX.ANY_CHARACTER));
        expect(builder.toString()).toBe('/^test.+/');
    });

    test('add', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.CHARACTERS_IN_SET("a-z"))
            .add('test')
            .followedBy(REGEX.DIGIT);
        expect(builder.toString()).toBe('/^[a-z]test\\d/');
    });

    test('endsWith', () => {
        const builder = new SimpleRegexBuilder().startsWith('hello').endsWith('world');
        expect(builder.toString()).toBe('/^helloworld$/');
    });

    test('ends', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').ends();
        expect(builder.toString()).toBe('/^test$/');
    });
});

describe('SimpleRegexBuilder groups', () => {
    test('single group', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.IN_SET('hello', 'world'));
        expect(builder.toString()).toBe('/^(hello|world)/');
    });

    test('multiple groups', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.IN_SET('hello', 'goodbye')).followedBy(REGEX.IN_SET('world', 'universe'));
        expect(builder.toString()).toBe('/^(hello|goodbye)(world|universe)/');
    });

    test('nested groups', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.IN_SET(REGEX.IN_SET('hello', 'goodbye'), 'world'));
        expect(builder.toString()).toBe('/^((hello|goodbye)|world)/');
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
