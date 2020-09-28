// @flow

import soundex from 'soundex';

export type SoundexPatterns = Array<{
    pattern: RegExp,
    word: string
}>;

export default class SoundexTable {
    patterns: SoundexPatterns;

    constructor(patterns: SoundexPatterns) {
        this.patterns = patterns;
    }

    lookupWord(inputWord: string): ?string {
        const maybeNumberInput = parseInt(inputWord);
        if (maybeNumberInput || maybeNumberInput === 0) {
            switch(maybeNumberInput) {
                case 0:
                    inputWord = 'zero';
                    break;
                case 1:
                    inputWord = 'one';
                    break;
                case 2:
                    inputWord = 'two';
                    break;
                case 3:
                    inputWord = 'three';
                    break;
                case 4:
                    inputWord = 'four';
                    break;
                case 5:
                    inputWord = 'five';
                    break;
                case 6:
                    inputWord = 'six';
                    break;
                case 7:
                    inputWord = 'seven';
                    break;
                case 8:
                    inputWord = 'eight';
                    break;
                case 9:
                    inputWord = 'nine';
                    break;
                case 10:
                    inputWord = 'ten';
                    break;
                default:
                    break;
            }
        }
        const afterSoundex: string = soundex(inputWord);
        for (const entry of this.patterns) {
            if (entry.pattern.test(afterSoundex)) {
                return entry.word;
            }
        }
        return undefined;
    }
};
