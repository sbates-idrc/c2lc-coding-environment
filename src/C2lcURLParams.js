// @flow

export default class C2lcURLParams {
    urlSearchParams: URLSearchParams;

    constructor(query: string) {
        this.urlSearchParams = new URLSearchParams(query);
    }

    getVersion(): string | null {
        return this.urlSearchParams.get('v');
    }

    getProgram(): string | null {
        return this.urlSearchParams.get('p');
    }

    getCharacterState(): string | null {
        return this.urlSearchParams.get('c');
    }

    getTheme(): string | null {
        return this.urlSearchParams.get('t');
    }

    getDisallowedActions(): string | null {
        return this.urlSearchParams.get('d');
    }

    getWorld(): string | null {
        return this.urlSearchParams.get('w');
    }

    getStartingPosition(): string | null {
        return this.urlSearchParams.get('s');
    }
}
