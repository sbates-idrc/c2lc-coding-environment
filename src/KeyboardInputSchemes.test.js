import {keyboardEventMatchesKeyDef, findKeyboardEventSequenceMatches} from './KeyboardInputSchemes';

it('Should be able to handle unmodified keys', ()  => {
    const keyDef = { key: "?" };

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(true);

    const controlModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(false);

    const altModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "?", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle control keys', ()  => {
    const keyDef = { key: "A", ctrlKey: true };

    const controlModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A", ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);


    const controlAltModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "A", altKey: true, ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlAltModifiedKeyboardEvent, keyDef)).toBe(false);
});

it('Should be able to handle alt keys', ()  => {
    const keyDef = { key: "B", altKey: true };

    const altModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true});
    expect(keyboardEventMatchesKeyDef(altModifiedKeyboardEvent, keyDef)).toBe(true);

    const unmodifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B"});
    expect(keyboardEventMatchesKeyDef(unmodifiedKeyboardEvent, keyDef)).toBe(false);

    const controlAltModifiedKeyboardEvent = new KeyboardEvent('keydown', { key: "B", altKey: true, ctrlKey: true});
    expect(keyboardEventMatchesKeyDef(controlAltModifiedKeyboardEvent, keyDef)).toBe(false);
});


it('Should be able to handle a complete valid sequence', () => {
    const completeValidSequence = [
        new KeyboardEvent('keydown', { code: "KeyC", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyF"}),
        new KeyboardEvent('keydown', { key: "2"})
    ];

    const result = findKeyboardEventSequenceMatches(completeValidSequence, "alt");
    expect(result).toBe("selectForward2");
});

it('Should be able to handle a complete invalid sequence', () => {
    const completeInvalidSequence = [
        new KeyboardEvent('keydown', { code: "KeyF", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyX"})
    ];
    const result = findKeyboardEventSequenceMatches(completeInvalidSequence, "alt");
    expect(result).toBe(false);
});

it('Should be able to handle a partial sequence', () => {
    const partialSequence = [
        new KeyboardEvent('keydown', { code: "KeyC", altKey: true}),
        new KeyboardEvent('keydown', { code: "KeyB"})
    ];

    const result = findKeyboardEventSequenceMatches(partialSequence, "alt");
    expect(result).toBe("partial");
});