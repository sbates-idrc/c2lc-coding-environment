//@flow
export type KeyboardInputSchemeName = "alt" | "nvda";

export type KeyDef = {
    code?: string,
    key?: string,
    altKey?: boolean,
    ctrlKey?: boolean,
    hidden?: boolean
};

type ActionName =
    // Single Key Commands
    | "addCommandToBeginning"
    | "addCommandToEnd"
    | "announceScene"
    | "decreaseProgramSpeed"
    | "increaseProgramSpeed"
    | "playPauseProgram"
    | "refreshScene"
    | "showHide"
    | "stopProgram"
    | "toggleAnnouncements"

    // Select Command Sequences
    | "selectForward1"
    | "selectForward2"
    | "selectForward3"
    | "selectBackward1"
    | "selectBackward2"
    | "selectBackward3"
    | "selectLeft45"
    | "selectLeft90"
    | "selectLeft180"
    | "selectRight45"
    | "selectRight90"
    | "selectRight180"

    //  Focus Command Sequences
    | "focusCommands"
    // TODO: Add more.
    ;

type ActionKeyStep = {
    actionName: ActionName,
    keyDef: KeyDef
};

type KeySequenceStep = {
    keyDef: KeyDef,
    [string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputScheme = {
    [string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputSchemesType = {
    "alt":  KeyboardInputScheme,
    "nvda": KeyboardInputScheme
};

export const KeyboardInputSchemes:KeyboardInputSchemesType = {
    "alt": {
        addCommandToBeginning: {
            keyDef: { code: "KeyB", altKey: true},
            actionName: "addCommandToBeginning"
        },
        addCommandToEnd: {
            keyDef: { code: "KeyE", altKey: true},
            actionName: "addCommandToEnd"
        },
        announceScene: {
            keyDef: { code: "KeyI", altKey: true},
            actionName: "announceScene"
        },
        decreaseProgramSpeed: {
            keyDef: { key: "<", hidden: true},
            actionName: "decreaseProgramSpeed"
        },
        increaseProgramSpeed: {
            keyDef: { key: ">", hidden: true},
            actionName: "increaseProgramSpeed"
        },
        playPauseProgram: {
            keyDef: { code: "KeyP", altKey: true},
            actionName: "playPauseProgram"
        },
        refreshScene: {
            keyDef: { code: "KeyR", altKey: true},
            actionName: "refreshScene"
        },
        showHide: {
            keyDef: { key: "?"},
            actionName: "showHide"
        },
        stopProgram: {
            keyDef: { code: "KeyS", altKey: true},
            actionName: "stopProgram"
        },
        toggleAnnouncements: {
            keyDef: { code: "KeyA", altKey: true, hidden: true},
            actionName: "toggleAnnouncements"
        },

        focusChange: {
            keyDef: {
                code: "KeyF", altKey: true, hidden:true
            },
            commandBlock: {
                keyDef: { code: "KeyC"},
                actionName: "focusCommands"
            }
        },

        selectedCommandChange: {
            keyDef: { code: "KeyC", altKey: true, hidden:true},
            forward: {
                keyDef: { code: "KeyF"},
                forward1: {
                    keyDef: { key: "1"},
                    actionName: "selectForward1"
                },
                forward2: {
                    keyDef: { key: "2"},
                    actionName: "selectForward2"
                },
                forward3: {
                    keyDef: { key: "3"},
                    actionName: "selectForward3"
                }
            },
            backward: {
                keyDef: { code: "KeyB"},
                backward1: {
                    keyDef: { key: "1"},
                    actionName: "selectBackward1"
                },
                backward2: {
                    keyDef: { key: "2"},
                    actionName: "selectBackward2"
                },
                backward3: {
                    keyDef: { key: "3"},
                    actionName: "selectBackward3"
                }
            },
            left: {
                keyDef: { code: "KeyL"},
                left45: {
                    keyDef: { key: "1"},
                    actionName: "selectLeft45"
                },
                left90: {
                    keyDef: { key: "2"},
                    actionName: "selectLeft90"
                },
                left180: {
                    keyDef: { key: "3"},
                    actionName: "selectLeft180"
                }
            },
            right: {
                keyDef: { code: "KeyR"},
                right45: {
                    keyDef: { key: "1"},
                    actionName: "selectRight45"
                },
                right90: {
                    keyDef: { key: "2"},
                    actionName: "selectRight90"
                },
                right180: {
                    keyDef: { key: "3"},
                    actionName: "selectRight180"
                }
            }
        }
    },
    "nvda": {
        addCommandToBeginning: {
            keyDef: { code: "KeyB", altKey: true, ctrlKey: true},
            actionName: "addCommandToBeginning"
        },
        addCommandToEnd: {
            keyDef: { code: "KeyE", altKey: true, ctrlKey: true},
            actionName: "addCommandToEnd"
        },
        announceScene: {
            keyDef: {code: "KeyI", altKey: true, ctrlKey: true},
            actionName: "announceScene"
        },
        decreaseProgramSpeed: {
            keyDef: { key: "<", shiftKey: true, hidden: true},
            actionName: "decreaseProgramSpeed"
        },
        increaseProgramSpeed: {
            keyDef: { key: ">", shiftKey: true, hidden: true},
            actionName: "increaseProgramSpeed"
        },
        playPauseProgram: {
            keyDef: { code: "KeyP", altKey: true, ctrlKey: true},
            actionName: "playPauseProgram"
        },
        refreshScene: {
            keyDef: { code: "KeyR", altKey: true, ctrlKey: true },
            actionName: "refreshScene"
        },
        showHide: {
            keyDef: { key: "?", shiftKey: true },
            actionName: "showHide"
        },
        stopProgram: {
            keyDef: {code: "KeyS", altKey: true, ctrlKey: true},
            actionName: "stopProgram"
        },
        toggleAnnouncements: {
            keyDef: { code: "KeyA", altKey: true, ctrlKey: true, hidden: true },
            actionName: "toggleAnnouncements"
        },

        focusChange: {
            keyDef: { code: "KeyF", altKey: true, hidden:true},
            commandBlock: {
                keyDef: { code: "KeyC"},
                actionName: "focusCommands"
            }
        },
        SelectedCommandChange: {
            keyDef: { code: "KeyC", altKey: true, hidden:true},
            forward: {
                keyDef: { code: "KeyF"},
                forward1: {
                    keyDef: { key: "1"},
                    actionName: "selectForward1"
                },
                forward2: {
                    keyDef: { key: "2"},
                    actionName: "selectForward2"
                },
                forward3: {
                    keyDef: { key: "3"},
                    actionName: "selectForward3"
                }
            },
            backward: {
                keyDef: { code: "KeyB"},
                backward1: {
                    keyDef: { key: "1"},
                    actionName: "selectBackward1"
                },
                backward2: {
                    keyDef: { key: "2"},
                    actionName: "selectBackward2"
                },
                backward3: {
                    keyDef: { key: "3"},
                    actionName: "selectBackward3"
                }
            },
            left: {
                keyDef: { code: "KeyL"},
                left45: {
                    keyDef: { key: "1"},
                    actionName: "selectLeft45"
                },
                left90: {
                    keyDef: { key: "2"},
                    actionName: "selectLeft90"
                },
                left180: {
                    keyDef: { key: "3"},
                    actionName: "selectLeft180"
                }
            },
            right: {
                keyDef: { keyCode: "KeyR"},
                right45: {
                    keyDef: { key: "1"},
                    actionName: "selectRight45"
                },
                right90: {
                    keyDef: { key: "2"},
                    actionName: "selectRight90"
                },
                right180: {
                    keyDef: { key: "3"},
                    actionName: "selectRight180"
                }
            }
        }
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
        if (!!(keyDef.altKey) !== !!(e.altKey)) {
            return false;
        }
        if (!!(keyDef.ctrlKey) !== !!(e.ctrlKey)) {
            return false;
        }
        return true;
    }

    return false;
};

export function findKeyboardEventSequenceMatches (events: Array<KeyboardEvent>, keyboardInputSchemeName: KeyboardInputSchemeName):ActionName | false | "partial" {
    const keyboardInputScheme = KeyboardInputSchemes[keyboardInputSchemeName];
    let match = false;

    for (const singleKeySequence of Object.values(keyboardInputScheme)) {
        if (match === false || match === "partial") {
            // $FlowFixMe: Flow doesn't believe this matches our "or"ed set of allowed inputs.
            const keySequenceMatch = matchSingleInputSchemeLevel(events, singleKeySequence, 0);
            if (keySequenceMatch !== false) {
                match = keySequenceMatch;
            }
        }
    }

    return match;
}

function matchSingleInputSchemeLevel (events: Array<KeyboardEvent>, inputSchemeLevel: KeySequenceStep | ActionKeyStep, scanLevel:number): ActionName | false | "partial" {
    const eventToEvaluate = events[scanLevel];
    if (keyboardEventMatchesKeyDef(eventToEvaluate, inputSchemeLevel.keyDef)) {
        if (events.length === (scanLevel + 1)) {
            if (inputSchemeLevel.actionName) {
                // $FlowFixMe: Flow doesn't get that this is one of the things we can return, i.e. an ActionName;
                return inputSchemeLevel.actionName;
            }
            else {
                return "partial";
            }
        }
        else if (events.length > (scanLevel + 1)) {
            let subMatch = false;
            for (const [key, nextInputSchemeLevel] of Object.entries(inputSchemeLevel)) {
                if (key !== "keyDef" && subMatch === false) {
                    // $FlowFixMe: Flow doesn't get our "or"ed list of acceptable inputs.
                    subMatch = matchSingleInputSchemeLevel(events, nextInputSchemeLevel, scanLevel + 1);
                }
            };
            return subMatch;
        }
    }
    return false;
}