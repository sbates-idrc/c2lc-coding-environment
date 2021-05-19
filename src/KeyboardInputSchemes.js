//@flow
export type KeyboardInputSchemeName = "alt" | "windows";

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
    "windows": KeyboardInputScheme
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
    "windows": {
        addCommandToBeginning: { code: "KeyB", altKey: true},
        addCommandToEnd: { code: "KeyE", altKey: true},
        announceScene: { code: "KeyI", altKey: true},
        decreaseProgramSpeed: { code: "<", altKey: true},
        increaseProgramSpeed: { code: ">", altKey: true},
        playPauseProgram: { code: "KeyP", altKey: true},
        refreshScene: { code: "KeyR", altKey: true},
        showHide: { code: "?", altKey: true},
        stopProgram: { code: "KeyS", altKey: true},
        toggleAnnouncements: { code: "KeyA", altKey: true}
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

    return false;
};