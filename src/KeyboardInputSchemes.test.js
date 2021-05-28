import {keyboardEventMatchesKeyDef} from './KeyboardInputSchemes';

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


it('Should be able to handle shift keys', ()  => {
    const keyDef = { key: "C", shiftKey: true };

    const shiftyKeyboardEvent = new KeyboardEvent('keydown', { key: "C", shiftKey: true});
    expect(keyboardEventMatchesKeyDef(shiftyKeyboardEvent, keyDef)).toBe(true);

    const nonShiftyKeyboardEvent = new KeyboardEvent('keydown', { key: "C"});
    expect(keyboardEventMatchesKeyDef(nonShiftyKeyboardEvent, keyDef)).toBe(false);
});