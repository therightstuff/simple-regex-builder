"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRegexBuilder = exports.REGEX = void 0;
exports.REGEX = {
    ANY_CHARACTER: '.',
    ANY_DIGIT: '\\d',
    ANY_LETTER: '\\w',
    ANY_WHITESPACE: '\\s',
    ANY_CHARACTER_IN_SET: (characters) => `[${characters}]`,
    ANY_CHARACTER_NOT_IN_SET: (characters) => `[^${characters}]`,
    ZERO_OR_MORE: (regex) => `${regex}*`,
    ONE_OR_MORE: (regex) => `${regex}+`,
    OPTIONAL: (regex) => `${regex}?`,
    ZERO_OR_ONE: (regex) => `${regex}?`,
    EXACTLY_N: (n, regex) => `${regex}{${n}}`,
    AT_LEAST_N: (n, regex) => `${regex}{${n},}`,
    BETWEEN_N_AND_M: (n, m, regex) => `${regex}{${n},${m}}`,
    OR: '|',
    GROUP: (group) => `(${group.toString()})`,
};
class SimpleRegexBuilder {
    constructor(regex) {
        this._modifiers = {};
        this._parts = [];
        if (regex instanceof SimpleRegexBuilder) {
            return regex.clone();
        }
        this._regex = regex;
        this._startsWith = undefined;
        this._endsWith = undefined;
    }
    clone() {
        let clone = new SimpleRegexBuilder();
        clone._endsWith = this._endsWith;
        clone._modifiers = Object.assign({}, this._modifiers);
        clone._parts = [...this._parts];
        clone._regex = this._regex;
        clone._startsWith = this._startsWith;
        return clone;
    }
    global(isGlobal = true) {
        this._modifiers['g'] = isGlobal;
        return this;
    }
    ignoreCase(isIgnoreCase = true) {
        this._modifiers['i'] = isIgnoreCase;
        return this;
    }
    multiline(isMultiline = true) {
        this._modifiers['m'] = isMultiline;
        return this;
    }
    startsWith(regex) {
        this._startsWith = regex || '';
        return this;
    }
    add(regex) {
        this._parts.push(regex);
        return this;
    }
    followedBy(regex) {
        return this.add(regex);
    }
    ends() {
        return this.endsWith('');
    }
    endsWith(regex = '') {
        this._endsWith = regex;
        return this;
    }
    build() {
        if (this._regex) {
            return this._regex instanceof SimpleRegexBuilder ? this._regex.build() : this._regex;
        }
        let regexString = "";
        if (this._startsWith) {
            regexString += `^${this._startsWith.toString()}`;
        }
        if (this._parts.length > 0) {
            regexString += this._parts.map((part) => part.toString()).join('');
        }
        if (this._endsWith != undefined) {
            regexString += `${this._endsWith.toString()}$`;
        }
        // combine the modifiers
        let modifiers = Object.keys(this._modifiers).filter((key) => this._modifiers[key]).join('');
        return new RegExp(regexString, modifiers);
    }
    exec(input) {
        return this.build().exec(input);
    }
    test(input) {
        return this.build().test(input);
    }
    toRegExp() {
        return this.build();
    }
    toString() {
        return this.build().toString();
    }
}
exports.SimpleRegexBuilder = SimpleRegexBuilder;
