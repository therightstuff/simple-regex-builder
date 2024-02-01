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
        this._parts = [];
        this._regex = regex;
        this._startsWith = undefined;
        this._endsWith = undefined;
    }
    startsWith(regex) {
        this._startsWith = regex || '';
        return this;
    }
    ends() {
        this._endsWith = '';
        return this;
    }
    endsWith(regex) {
        this._endsWith = regex || '';
        return this;
    }
    followedBy(regex) {
        this._parts.push(regex);
        return this;
    }
    has(regex) {
        this._parts.push(regex);
        return this;
    }
    build() {
        if (this._regex) {
            return this._regex.toString();
        }
        let regexString = "";
        if (this._startsWith) {
            regexString += `^${this._startsWith.toString()}`;
        }
        if (this._endsWith != undefined) {
            regexString += `${this._endsWith.toString()}$`;
        }
        if (this._parts.length > 0) {
            regexString += this._parts.map((part) => part.toString()).join('');
        }
        return regexString;
    }
    toString() {
        return this._regex ? this._regex.toString() : this.build();
    }
}
exports.SimpleRegexBuilder = SimpleRegexBuilder;
