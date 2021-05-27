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

const labelMessageKeysByCode = {
    "KeyA": "KeyboardInputModal.KeyLabels.A",
    "KeyB": "KeyboardInputModal.KeyLabels.B",
    "KeyE": "KeyboardInputModal.KeyLabels.E",
    "KeyI": "KeyboardInputModal.KeyLabels.I",
    "KeyP": "KeyboardInputModal.KeyLabels.P",
    "KeyS": "KeyboardInputModal.KeyLabels.S",
    "KeyR": "KeyboardInputModal.KeyLabels.R"
};

const labelMessageKeysByKey = {
    "?": "KeyboardInputModal.KeyLabels.QuestionMark",
    ">": "KeyboardInputModal.KeyLabels.GreaterThan",
    "<": "KeyboardInputModal.KeyLabels.LessThan"
};

export function getLabelMessageKeyFromKeyDef (keyDef: KeyDef) {
    if (keyDef.code && labelMessageKeysByCode[keyDef.code]) {
        return labelMessageKeysByCode[keyDef.code];
    }
    else if (keyDef.key && labelMessageKeysByKey[keyDef.key]) {
        return labelMessageKeysByKey[keyDef.key];
    }
    else {
        return "";
    }
};

const iconMessageKeysByCode = {
    "KeyA": "KeyboardInputModal.KeyIcons.A",
    "KeyB": "KeyboardInputModal.KeyIcons.B",
    "KeyE": "KeyboardInputModal.KeyIcons.E",
    "KeyI": "KeyboardInputModal.KeyIcons.I",
    "KeyP": "KeyboardInputModal.KeyIcons.P",
    "KeyS": "KeyboardInputModal.KeyIcons.S",
    "KeyR": "KeyboardInputModal.KeyIcons.R"
};

const iconMessageKeysByKey = {
    "?": "KeyboardInputModal.KeyIcons.QuestionMark",
    ">": "KeyboardInputModal.KeyIcons.GreaterThan",
    "<": "KeyboardInputModal.KeyIcons.LessThan"
};

export function getIconMessageKeyFromKeyDef (keyDef: KeyDef) {
    if (keyDef.code && iconMessageKeysByCode[keyDef.code]) {
        return iconMessageKeysByCode[keyDef.code];
    }
    else if (keyDef.key && iconMessageKeysByKey[keyDef.key]) {
        return iconMessageKeysByKey[keyDef.key];
    }
    else {
        return "";
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