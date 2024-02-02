export const REGEX = {
    ANY_CHARACTER: '.',
    ANY_DIGIT: '\\d',
    ANY_LETTER: '\\w',
    ANY_WHITESPACE: '\\s',
    ANY_CHARACTER_IN_SET: (characters: string) => `[${characters}]`,
    ANY_CHARACTER_NOT_IN_SET: (characters: string) => `[^${characters}]`,
    ZERO_OR_MORE: (regex: string | RegExp | SimpleRegexBuilder) => {
        if (typeof regex === "string" && regex.length === 1) {
            return `${regex}*`;
        }
        if (regex instanceof RegExp) {
            return `(${regex.source})*`;
        }
        if (regex instanceof SimpleRegexBuilder) {
            return `(${regex.toRegExp().source})*`;
        }
        return `(${regex})*`;
    },
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
    private _endsWith: string | SimpleRegexBuilder | undefined;
    private _modifiers: { [key: string]: boolean } = {};
    private _parts: any[] = [];
    private _regex: RegExp | SimpleRegexBuilder | undefined;
    private _startsWith: string | SimpleRegexBuilder | undefined;

    constructor(regex?: RegExp | SimpleRegexBuilder) {
        if (regex instanceof SimpleRegexBuilder) {
            return regex.clone();
        }
        this._regex = regex;
        this._startsWith = undefined;
        this._endsWith = undefined;
    }

    public clone(): SimpleRegexBuilder {
        let clone = new SimpleRegexBuilder();
        clone._endsWith = this._endsWith;
        clone._modifiers = { ...this._modifiers };
        clone._parts = [...this._parts];
        clone._regex = this._regex;
        clone._startsWith = this._startsWith;
        return clone;
    }

    public global(isGlobal: boolean = true): SimpleRegexBuilder {
        this._modifiers['g'] = isGlobal;
        return this;
    }

    public ignoreCase(isIgnoreCase: boolean = true): SimpleRegexBuilder {
        this._modifiers['i'] = isIgnoreCase;
        return this;
    }

    public multiline(isMultiline: boolean = true): SimpleRegexBuilder {
        this._modifiers['m'] = isMultiline;
        return this;
    }

    public startsWith(regex?: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._startsWith = regex || '';
        return this;
    }

    public add(regex: string | SimpleRegexBuilder): SimpleRegexBuilder {
        this._parts.push(regex);
        return this;
    }

    public followedBy(regex: string | SimpleRegexBuilder): SimpleRegexBuilder {
        return this.add(regex);
    }

    public ends(): SimpleRegexBuilder {
        return this.endsWith('');
    }

    public endsWith(regex: string | SimpleRegexBuilder = ''): SimpleRegexBuilder {
        this._endsWith = regex;
        return this;
    }

    private build(): RegExp {
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

    public exec(input: string): RegExpExecArray | null {
        return this.build().exec(input);
    }

    public test(input: string): boolean {
        return this.build().test(input);
    }

    public toRegExp(): RegExp {
        return this.build();
    }

    public toString(): string {
        return this.build().toString();
    }
}
