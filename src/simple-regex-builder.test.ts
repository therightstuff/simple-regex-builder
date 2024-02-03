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

describe('SimpleRegexBuilder RegExp methods', () => {
    test('exec', () => {
        const builder = new SimpleRegexBuilder().add('ain');
        expect(builder.toString()).toBe('/ain/');
        expect(JSON.stringify(builder.exec('the rain in spain'))).toEqual(JSON.stringify(["ain"]));
        expect(builder.exec('this must fail')).toBeNull();
    });

    test('test', () => {
        const builder = new SimpleRegexBuilder().startsWith('test');
        expect(builder.toString()).toBe('/^test/');
        expect(builder.test('test')).toBe(true);
        expect(builder.test('not test')).toBe(false);
    });

    test('toString', () => {
        const builder = new SimpleRegexBuilder().startsWith('test');
        expect(builder.toString()).toBe('/^test/');
    });

    test('toRegExp', () => {
        const builder = new SimpleRegexBuilder().startsWith('test');
        expect(builder.toRegExp().source).toBe('^test');
    });
});

describe('SimpleRegexBuilder chaining', () => {
    test('startsWith', () => {
        const stringBuilder = new SimpleRegexBuilder().startsWith('test');
        expect(stringBuilder.toString()).toBe('/^test/');
        const regExpBuilder = new SimpleRegexBuilder().startsWith(new RegExp('test'));
        expect(regExpBuilder.toString()).toBe('/^test/');
        const builderBuilder = new SimpleRegexBuilder().startsWith(new SimpleRegexBuilder().add('test'));
        expect(builderBuilder.toString()).toBe('/^test/');
    });

    test('add and followedBy', () => {
        const normalOrder = new SimpleRegexBuilder().startsWith(REGEX.CHARACTERS_IN_SET("a-z"))
            .add(' first ')
            .followedBy(REGEX.DIGIT);
        expect(normalOrder.toString()).toBe('/^[a-z] first \\d/');
        const reverseOrder = new SimpleRegexBuilder()
            .followedBy(REGEX.DIGIT)
            .add(' first ')
            .startsWith(REGEX.CHARACTERS_IN_SET("a-z"));
        expect(reverseOrder.toString()).toBe('/^[a-z]\\d first /');
    });

    test('starts and ends', () => {
        const normalOrder = new SimpleRegexBuilder().startsWith('start').add('-').endsWith('end');
        expect(normalOrder.toString()).toBe('/^start-end$/');
        const reverseOrder = new SimpleRegexBuilder().endsWith('end').add('-').startsWith('start');
        expect(reverseOrder.toString()).toBe('/^start-end$/');
    });

    test('ends', () => {
        const builder = new SimpleRegexBuilder().startsWith(' start ').ends();
        expect(builder.toString()).toBe('/^ start $/');
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

describe('SimpleRegexBuilder modifiers', () => {
    test('global', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').global();
        expect(builder.toString()).toBe('/^test/g');
    });

    test('ignoreCase', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').ignoreCase();
        expect(builder.toString()).toBe('/^test/i');
    });

    test('multiline', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').multiline();
        expect(builder.toString()).toBe('/^test/m');
    });

    test('unicode', () => {
        const builder = new SimpleRegexBuilder().startsWith('test').unicode();
        expect(builder.toString()).toBe('/^test/u');
    });
});

describe('SimpleRegexBuilder multiline modifier', () => {
    test('multiline test fails when multiline not selected', () => {
        const builder = new SimpleRegexBuilder().startsWith('second');
        expect(builder.toString()).toBe(`/^second/`);
        expect(builder.test(`first line
second line`)).toBe(false);
    });

    test('multiline test succeeds when multiline selected', () => {
        const builder = new SimpleRegexBuilder().startsWith('second').multiline();
        expect(builder.toString()).toBe(`/^second/m`);
        expect(builder.test(`first line
second line`)).toBe(true);
    });
});
