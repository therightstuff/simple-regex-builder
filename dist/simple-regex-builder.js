"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRegexBuilder = void 0;
const normalizeRegexParam = (regex) => {
    if (regex) {
        if (regex instanceof SimpleRegexBuilder) {
            return regex.build().source;
        }
        if (regex instanceof RegExp) {
            return regex.source;
        }
        return regex;
    }
    // handle empty string
    if (typeof regex === 'string') {
        return regex;
    }
    return undefined;
};
class SimpleRegexBuilder {
    constructor(regex) {
        this._modifiers = {};
        this._parts = [];
        if (regex) {
            if (regex instanceof SimpleRegexBuilder) {
                return regex.clone();
            }
            this._parts.push(normalizeRegexParam(regex));
            if (regex instanceof RegExp) {
                this._modifiers['g'] = regex.global;
                this._modifiers['i'] = regex.ignoreCase;
                this._modifiers['m'] = regex.multiline;
                this._modifiers['u'] = regex.unicode;
            }
        }
        this._startsWith = undefined;
        this._endsWith = undefined;
    }
    clone() {
        let clone = new SimpleRegexBuilder();
        clone._endsWith = this._endsWith;
        clone._modifiers = Object.assign({}, this._modifiers);
        clone._parts = [...this._parts];
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
    unicode(isUnicode = true) {
        this._modifiers['u'] = isUnicode;
        return this;
    }
    startsWith(regex) {
        this._startsWith = normalizeRegexParam(regex);
        return this;
    }
    add(regex) {
        this._parts.push(normalizeRegexParam(regex));
        return this;
    }
    followedBy(regex) {
        return this.add(normalizeRegexParam(regex));
    }
    ends() {
        return this.endsWith('');
    }
    endsWith(regex = '') {
        this._endsWith = normalizeRegexParam(regex);
        return this;
    }
    build() {
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
