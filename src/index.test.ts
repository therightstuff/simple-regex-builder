import { REGEX, SimpleRegexBuilder } from './index';

describe('SimpleRegexBuilder string construction', () => {
    test('simple', () => {
        const builder = new SimpleRegexBuilder('test');
        expect(builder.toString()).toBe('test');
    });

    test('startsWith', () => {
        const builder = new SimpleRegexBuilder().startsWith('test');
        expect(builder.toString()).toBe('^test');
    });
});

describe('SimpleRegexBuilder clone construction', () => {
    test('string-based', () => {
        const builder = new SimpleRegexBuilder('test');
        const clone = new SimpleRegexBuilder(builder);
        expect(clone.toString()).toBe('test');
    });

    test('builder-based', () => {
        const builder = new SimpleRegexBuilder().startsWith('test');
        const clone = new SimpleRegexBuilder(builder);
        expect(clone.toString()).toBe('^test');
    });
});

describe('SimpleRegexBuilder chaining', () => {
    test('followedBy', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').followedBy(REGEX.ONE_OR_MORE(REGEX.ANY_CHARACTER));
        expect(builder.toString()).toBe('^test.+');
    });

    test('has', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.ANY_CHARACTER_IN_SET("a-z")).has('test');
        expect(builder.toString()).toBe('^[a-z]test');
    });

    test('endsWith', () => {
        const builder = new SimpleRegexBuilder().startsWith('hello').endsWith('world');
        expect(builder.toString()).toBe('^helloworld$');
    });

    test('ends', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').ends();
        expect(builder.toString()).toBe('^test$');
    });
});

describe('SimpleRegexBuilder groups', () => {
    test('single group', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.GROUP('test'));
        expect(builder.toString()).toBe('^(test)');
    });

    test('multiple groups', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.GROUP('test')).followedBy(REGEX.GROUP('hello'));
        expect(builder.toString()).toBe('^(test)(hello)');
    });

    test('nested groups', () => {
        const builder = new SimpleRegexBuilder().startsWith(REGEX.GROUP(REGEX.GROUP('test')));
        expect(builder.toString()).toBe('^((test))');
    });
});

describe('REGEX builder interchangeability', () => {
    test('REGEX.ZERO_OR_MORE string', () => {
        expect(REGEX.ZERO_OR_MORE('test')).toBe('test*');
    });
    test('REGEX.ZERO_OR_MORE builder', () => {
        expect(REGEX.ZERO_OR_MORE(new SimpleRegexBuilder('test'))).toBe('test*');
    });
});
