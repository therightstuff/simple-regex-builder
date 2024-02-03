const normalizeRegexParam = (regex?: string | RegExp | SimpleRegexBuilder): string | undefined => {
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
}

export class SimpleRegexBuilder {
    private _endsWith: string | SimpleRegexBuilder | undefined;
    private _modifiers: { [key: string]: boolean } = {};
    private _parts: any[] = [];
    private _startsWith: string | SimpleRegexBuilder | undefined;

    constructor(regex?: string | RegExp | SimpleRegexBuilder) {
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

    public clone(): SimpleRegexBuilder {
        let clone = new SimpleRegexBuilder();
        clone._endsWith = this._endsWith;
        clone._modifiers = { ...this._modifiers };
        clone._parts = [...this._parts];
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

    public unicode(isUnicode: boolean = true): SimpleRegexBuilder {
        this._modifiers['u'] = isUnicode;
        return this;
    }

    public startsWith(regex?: string | RegExp | SimpleRegexBuilder): SimpleRegexBuilder {
        this._startsWith = normalizeRegexParam(regex);
        return this;
    }

    public add(regex: string | RegExp | SimpleRegexBuilder): SimpleRegexBuilder {
        this._parts.push(normalizeRegexParam(regex));
        return this;
    }

    public followedBy(regex: string | RegExp | SimpleRegexBuilder): SimpleRegexBuilder {
        return this.add(normalizeRegexParam(regex));
    }

    public ends(): SimpleRegexBuilder {
        return this.endsWith('');
    }

    public endsWith(regex: string | RegExp | SimpleRegexBuilder = ''): SimpleRegexBuilder {
        this._endsWith = normalizeRegexParam(regex);
        return this;
    }

    public build(): RegExp {
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
