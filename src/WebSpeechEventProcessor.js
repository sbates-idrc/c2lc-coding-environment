// @flow

import SoundexTable from './SoundexTable';

import type {SpeechRecognitionEvent, SpeechRecognitionResult} from './types';

export default class WebSpeechEventProcessor {
    soundexTable: SoundexTable;
    numWordsSinceFinal: number;

    constructor(soundexTable: SoundexTable) {
        this.soundexTable = soundexTable;
        this.numWordsSinceFinal = 0;
    }

    processEvent(event: SpeechRecognitionEvent): Array<string> {
        const recognizedWords = [];
        let numWordsThisEvent = 0;
        // Loop through results, starting at resultIndex
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result: SpeechRecognitionResult = event.results[i];
            if (result.length > 0) {
                // Process the first alternative in each result
                for (const word:string  of result[0].transcript.trim().split(/\s+/)) {
                    // If this result contains words that we haven't seen yet
                    // (words since the last final), then run them through
                    // Soundex and add if they are words that we recognize
                    ++numWordsThisEvent;
                    if (numWordsThisEvent > this.numWordsSinceFinal) {
                        this.numWordsSinceFinal = this.numWordsSinceFinal + 1;
                        const afterSoundex = this.soundexTable.lookupWord(word);
                        if (afterSoundex) {
                            recognizedWords.push(afterSoundex);
                        }
                    }
                }
            }
            if (result.isFinal) {
                this.numWordsSinceFinal = 0;
            }
        }
        return recognizedWords;
    }

};
