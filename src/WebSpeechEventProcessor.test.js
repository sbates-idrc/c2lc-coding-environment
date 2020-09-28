// @flow

import WebSpeechEventProcessor from './WebSpeechEventProcessor';
import SoundexTable from './SoundexTable';

import type {SpeechRecognitionEvent, SpeechRecognitionResult, SpeechRecognitionAlternative} from './types';

const soundexTable = new SoundexTable([
    { pattern: /F663/, word: 'forward' }, // FRRD
    { pattern: /L130/, word: 'left'    }, // LFT
    { pattern: /R230/, word: 'right'   }  // RGT
]);

const speechRecognitionAlternativeTemplate: SpeechRecognitionAlternative = {
    transcript: "",
    confidence: 1
};

const speechRecognitionResultTemplate = {
    isFinal: true,
    transcript: ""
};

const speechRecognitionEventTemplate: SpeechRecognitionEvent = {
    emma: "",
    interpretation: "",
    resultIndex: 0,
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    results: []
}

const constructSampleEvent = (alternativeSnippets: Array<Array<{}>>, eventSnippet, resultSnippet): SpeechRecognitionEvent => {
    // Event from template with merged material if needed.
    const sampleEvent = {};
    Object.assign(sampleEvent, speechRecognitionEventTemplate, { results: [] });
    if (eventSnippet) {
        Object.assign(sampleEvent, eventSnippet);
    }

    const sampleResult = [];
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    Object.assign(sampleResult, speechRecognitionResultTemplate);
    if (resultSnippet) {
        // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
        Object.assign(sampleResult, resultSnippet)
    }

    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    sampleEvent.results.push(sampleResult);

    // TODO: Result from template

    for (let a = 0; a < alternativeSnippets.length; a++) {
        const mergedSampleResult = {};
        // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
        Object.assign(mergedSampleResult, speechRecognitionAlternativeTemplate, alternativeSnippets[a])
        sampleResult.push(mergedSampleResult);
    }

    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    return sampleEvent;
};

test('A result with no alternatives', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent = constructSampleEvent([{ length: 0 }])
    const words = processor.processEvent(sampleEvent);
    expect(words.length).toBe(0);
});

test('Single final word', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent = constructSampleEvent([{ transcript: 'frard'}]);
    const words = processor.processEvent(sampleEvent);
    expect(words.length).toBe(1);
    expect(words[0]).toBe('forward');
});

test('Two final words', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent = constructSampleEvent([{ transcript: 'frard lft'}]);
    const words = processor.processEvent(sampleEvent);
    expect(words.length).toBe(2);
    expect(words[0]).toBe('forward');
    expect(words[1]).toBe('left');
});

test('Multiple events', () => {
    const processor = new WebSpeechEventProcessor(soundexTable);

    // First event: first, non-final word
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent1 = constructSampleEvent([{ transcript: 'frard'}], undefined, {isFinal: false});
    const words1 = processor.processEvent(sampleEvent1);
    expect(words1.length).toBe(1);
    expect(words1[0]).toBe('forward');

    // Second event: finalize our first word
    // We expect no processed word here, as we have already seen the word
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent2 = constructSampleEvent([{ transcript: 'lft' }]);
    const words2 = processor.processEvent(sampleEvent2);
    expect(words2.length).toBe(0);

    // Third event: add a second word

    // This sample event is too complex for our helper constructor, we need to write it out manually.
    const firstResult: SpeechRecognitionResult = Object.assign(
        [ { transcript: 'lft' } ],
        ({ isFinal: true }: any)
    );
    const secondResult: SpeechRecognitionResult = Object.assign(
        [ { transcript: 'rgt' } ],
        ({ isFinal: false }: any)
    );
    const sampleEvent3: SpeechRecognitionEvent = {
        resultIndex: 1,
        // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
        results: [ firstResult, secondResult ]
    };

    const words3 = processor.processEvent(sampleEvent3);
    expect(words3.length).toBe(1);
    expect(words3[0]).toBe('right');

    // Fourth event: finalize the second word
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent4 = constructSampleEvent([{ transcript: 'lft' }]);
    const words4 = processor.processEvent(sampleEvent4);
    expect(words4.length).toBe(0);

    // Fifth event: now a third word, finalized, without interim
    // $FlowFixMe: Cannot accurately model the speech recognition "array like" structures yet.
    const sampleEvent5 = constructSampleEvent([ { transcript: 'frard' } ]);
    const words5 = processor.processEvent(sampleEvent5);
    expect(words5.length).toBe(1);
    expect(words5[0]).toBe('forward');
});
