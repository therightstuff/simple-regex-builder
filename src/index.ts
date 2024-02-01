export const REGEX = {
    ANY_CHARACTER: '.',
    ANY_DIGIT: '\\d',
    ANY_LETTER: '\\w',
    ANY_WHITESPACE: '\\s',
    ANY_CHARACTER_IN_SET: (characters: string) => `[${characters}]`,
    ANY_CHARACTER_NOT_IN_SET: (characters: string) => `[^${characters}]`,
    ZERO_OR_MORE: (regex: string | SimpleRegexBuilder) => `${regex}*`,
    ONE_OR_MORE: (regex: string | SimpleRegexBuilder) => `${regex}+`,
    OPTIONAL: (regex: string | SimpleRegexBuilder) => `${regex}?`,
    ZERO_OR_ONE: (regex: string | SimpleRegexBuilder) => `${regex}?`,
    EXACTLY_N: (n: number, regex: string | SimpleRegexBuilder) => `${regex}{${n}}`,
    AT_LEAST_N: (n: number, regex: string | SimpleRegexBuilder) => `${regex}{${n},}`,
    BETWEEN_N_AND_M: (n: number, m: number, regex: string | SimpleRegexBuilder) => `${regex}{${n},${m}}`,
    OR: '|',
    GROUP: (group: string | SimpleRegexBuilder) => `(${group.toString()})`,
};

export class SimpleRegexBuilder {
    private _regex: string | SimpleRegexBuilder | undefined;
    private _startsWith: string | SimpleRegexBuilder | undefined;
    private _endsWith: string | SimpleRegexBuilder | undefined;
    private _parts: any[] = [];

    constructor(regex?: string | SimpleRegexBuilder) {
        this._regex = regex;
        this._startsWith = undefined;
        this._endsWith = undefined;
    }

    public startsWith(regex?: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._startsWith = regex || '';
        return this;
    }

    public ends(): SimpleRegexBuilder {
        this._endsWith = '';
        return this;
    }

    public endsWith(regex?: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._endsWith = regex || '';
        return this;
    }

    public followedBy(regex: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._parts.push(regex);
        return this;
    }

    public has(regex: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._parts.push(regex);
        return this;
    }

    private build(): string {
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

    public toString(): string {
        return this._regex ? this._regex.toString() : this.build();
    }
}
