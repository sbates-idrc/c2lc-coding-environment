//@flow
export type KeyboardInputSchemeName = "alt" | "nvda";

export type KeyDef = {
    code?: string,
    key?: string,
    altKey?: boolean,
    shiftKey?: boolean,
    ctrlKey?: boolean
};

export type KeyboardInputScheme = {
    addCommandToBeginning: KeyDef,
    addCommandToEnd: KeyDef,
    announceScene: KeyDef,
    decreaseProgramSpeed: KeyDef,
    increaseProgramSpeed: KeyDef,
    playPauseProgram: KeyDef,
    refreshScene: KeyDef,
    showHide: KeyDef,
    stopProgram: KeyDef,
    toggleAnnouncements: KeyDef
}

export type KeyboardInputSchemesType = {
    "alt": KeyboardInputScheme,
    "nvda": KeyboardInputScheme
}

export const KeyboardInputSchemes:KeyboardInputSchemesType = {
    "alt": {
        addCommandToBeginning: { code: "KeyB", altKey: true},
        addCommandToEnd: { code: "KeyE", altKey: true},
        announceScene: { code: "KeyI", altKey: true},
        decreaseProgramSpeed: { key: "<" },
        increaseProgramSpeed: { key: ">" },
        playPauseProgram: { code: "KeyP", altKey: true},
        refreshScene: { code: "KeyR", altKey: true},
        showHide: { key: "?" },
        stopProgram: { code: "KeyS", altKey: true},
        toggleAnnouncements: { code: "KeyA", altKey: true}
    },
    "nvda": {
        addCommandToBeginning: { code: "KeyB", altKey: true, ctrlKey: true},
        addCommandToEnd: { code: "KeyE", altKey: true, ctrlKey: true},
        announceScene: { code: "KeyI", altKey: true, ctrlKey: true},
        decreaseProgramSpeed: { code: "<" },
        increaseProgramSpeed: { code: ">" },
        playPauseProgram: { code: "KeyP", altKey: true, ctrlKey: true},
        refreshScene: { code: "KeyR", altKey: true, ctrlKey: true},
        showHide: { key: "?" },
        stopProgram: { code: "KeyS", altKey: true, ctrlKey: true},
        toggleAnnouncements: { code: "KeyA", altKey: true, ctrlKey: true}
    }
};

export function keyboardEventMatchesKeyDef (e: KeyboardEvent, keyDef: KeyDef) {
    if (e.code === keyDef.code || e.key === keyDef.key) {
        if (keyDef.altKey && !e.altKey) {
            return false;
        }
        if (keyDef.shiftKey && !e.shiftKey) {
            return false;
        }
        if (keyDef.ctrlKey && !e.ctrlKey) {
            return false;
        }
        return true;
    }
    else {
        console.log('code', e.code, 'key', e.key);
    }

    return false;
};