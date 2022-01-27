//@flow
import {extend} from './Utils';

export type KeyboardInputSchemeName = "controlalt" | "alt";
export function isKeyboardInputSchemeName(str: ?string): boolean {
    return str === 'controlalt' || str === 'alt';
}

export type KeyDef = {
    code?: string,
    key?: string,
    altKey?: boolean,
    ctrlKey?: boolean,
    hidden?: boolean
};

export type ActionName =
    // Single Key Commands
    | "addCommand"
    | "addCommandToBeginning"
    | "addCommandToEnd"
    | "deleteCurrentStep"
    | "announceScene"
    | "decreaseProgramSpeed"
    | "increaseProgramSpeed"
    | "playPauseProgram"
    | "refreshScene"
    | "showHide"
    | "stopProgram"
    | "toggleFeedbackAnnouncements"

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

    // Focus Sequences
    | "focusActions"
    | "focusAppHeader"
    | "focusAddNodeToggle"
    | "focusCharacterPositionControls"
    | "focusCharacterColumnInput"
    | "focusCharacterRowInput"
    | "focusPlayShare"
    | "focusProgramSequence"
    | "focusScene"
    | "focusWorldSelector"

    // Character Position Sequences
    | "moveCharacterLeft"
    | "moveCharacterRight"
    | "moveCharacterUp"
    | "moveCharacterDown"
    | "turnCharacterLeft"
    | "turnCharacterRight"

    // Change Theme
    | "changeToDefaultTheme"
    | "changeToLightTheme"
    | "changeToDarkTheme"
    | "changeToGrayscaleTheme"
    | "changeToHighContrastTheme"

    // Update Program
    | "deleteAll"
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
    "controlalt": KeyboardInputScheme,
    "alt":  KeyboardInputScheme
};

const ExtendedKeyboardSequences: KeyboardInputScheme = {
    extraSettings: {
        keyDef: { code: "KeyX", key: "x", altKey: true, hidden: true},
        audioFeedback: {
            keyDef: { code: "KeyX", key: "x"},
            actionName: "toggleFeedbackAnnouncements",
            description: "Turn on/off audio feedback announcements"
        },
        focusChange: {
            keyDef: {
                code: "KeyF",
                key: "f"
            },
            actions: {
                keyDef: { code: "KeyA", key: "a" },
                actionName: "focusActions",
                description: "Move focus to Actions panel"
            },
            appHeader: {
                keyDef: { code: "KeyH", key: "h" },
                actionName: "focusAppHeader",
                description: "Move focus to the App Header"
            },
            addNodeToggle: {
                keyDef: { code: "KeyT", key: "t" },
                actionName: "focusAddNodeToggle",
                description: "Move focus to the Add Node Toggle"
            },
            characterPositionControls: {
                keyDef: { code: "KeyC", key: "c" },
                actionName: "focusCharacterPositionControls",
                description: "Move focus to Character position controls"
            },
            characterPositionColumnInput: {
                keyDef: { code: "KeyX", key: "x" },
                actionName: "focusCharacterColumnInput",
                description: "Move focus to the Character Column input field"
            },
            characterPositionRowInput: {
                keyDef: { code: "KeyX", key: "y" },
                actionName: "focusCharacterRowInput",
                description: "Move focus to the Character Row input field"
            },
            playShare: {
                keyDef: { code: "KeyP", key: "p" },
                actionName: "focusPlayShare",
                description: "Move focus to Play and Share area"
            },
            programSequence: {
                keyDef: { code: "KeyQ", key: "q" },
                actionName: "focusProgramSequence",
                description: "Move focus to the Program sequence"
            },
            scene: {
                keyDef: { code: "KeyS", key: "s" },
                actionName: "focusScene",
                description: "Move focus to the Scene"
            },
            worldSelector: {
                keyDef: { code: "KeyW", key: "w" },
                actionName: "focusWorldSelector",
                description: "Move focus to the World Selector"
            }
        },

        selectedActionChange: {
            keyDef: { code: "KeyA", key: "a" },
            forward: {
                keyDef: { code: "KeyF", key: "f" },
                forward1: {
                    keyDef: { key: "1"},
                    actionName: "selectForward1",
                    description: "Select Forward 1 square action block"
                },
                forward2: {
                    keyDef: { key: "2"},
                    actionName: "selectForward2",
                    description: "Select Forward 2 squares action block"
                },
                forward3: {
                    keyDef: { key: "3"},
                    actionName: "selectForward3",
                    description: "Select Forward 3 squares action block"
                }
            },
            backward: {
                keyDef: { code: "KeyB", key: "b" },
                backward1: {
                    keyDef: { key: "1"},
                    actionName: "selectBackward1",
                    description: "Select Backward 1 square action block"
                },
                backward2: {
                    keyDef: { key: "2"},
                    actionName: "selectBackward2",
                    description: "Select Backward 2 squares action block"
                },
                backward3: {
                    keyDef: { key: "3"},
                    actionName: "selectBackward3",
                    description: "Select Backward 3 squares action block"
                }
            },
            left: {
                keyDef: { code: "KeyL", key: "l" },
                left45: {
                    keyDef: { key: "1"},
                    actionName: "selectLeft45",
                    description: "Select Turn Left 45 degrees action block"
                },
                left90: {
                    keyDef: { key: "2"},
                    actionName: "selectLeft90",
                    description: "Select Turn Left 90 degrees action block"
                },
                left180: {
                    keyDef: { key: "3"},
                    actionName: "selectLeft180",
                    description: "Select Turn Left 180 degrees action block"
                }
            },
            right: {
                keyDef: { code: "KeyR", key: "r" },
                right45: {
                    keyDef: { key: "1"},
                    actionName: "selectRight45",
                    description: "Select Turn Right 45 degrees action block"
                },
                right90: {
                    keyDef: { key: "2"},
                    actionName: "selectRight90",
                    description: "Select Turn Right 90 degrees action block"
                },
                right180: {
                    keyDef: { key: "3"},
                    actionName: "selectRight180",
                    description: "Select Turn Right 180 degrees action block"
                }
            }
        },

        characterPosition: {
            keyDef: { code: "KeyC", key: "c" },
            move: {
                keyDef: { code: "KeyM", key: "m" },
                left: {
                    keyDef: { code: "KeyL", key: "l" },
                    actionName: "moveCharacterLeft",
                    description: "Move character Left by using character positioning tool"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "moveCharacterRight",
                    description: "Move character Right by using character positioning tool"
                },
                up: {
                    keyDef: { code: "KeyU", key: "u" },
                    actionName: "moveCharacterUp",
                    description: "Move character Up by using character positioning tool"
                },
                down: {
                    keyDef: { code: "KeyD", key: "d" },
                    actionName: "moveCharacterDown",
                    description: "Move character Down by using character positioning tool"
                }
            },
            turn: {
                keyDef: { code: "KeyT", key: "t" },
                left: {
                    keyDef: { code: "KeyL", key: "l" },
                    actionName: "turnCharacterLeft",
                    description: "Turn character Left 45 degrees by using character positioning tool"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "turnCharacterRight",
                    description: "Turn character Right 45 degrees by using character positioning tool"
                }
            }
        },

        changeTheme: {
            keyDef: { code: "KeyT", key: "t" },
            default: {
                keyDef: { key: "1"},
                actionName: "changeToDefaultTheme",
                description: "Change the current visual theme to the Default theme"
            },
            light: {
                keyDef: { key: "2"},
                actionName: "changeToLightTheme",
                description: "Change the current visual theme to the Light theme"
            },
            dark: {
                keyDef: { key: "3"},
                actionName: "changeToDarkTheme",
                description: "Change the current visual theme to the Dark theme"
            },
            grayscale: {
                keyDef: { key: "4"},
                actionName: "changeToGrayscaleTheme",
                description: "Change the current visual theme to the Grayscale theme"
            },
            highContrast: {
                keyDef: { key: "5"},
                actionName: "changeToHighContrastTheme",
                description: "Change the current visual theme to the High Contrast theme"
            }
        },

        deleteAll: {
            keyDef: { code: "KeyD", key: "d" },
            actionName: "deleteAll",
            description: "Delete all action blocks in the program"
        }
    }
}

const AltInputScheme: KeyboardInputScheme = Object.assign({
    addCommand: {
        keyDef: { code: "KeyA", key: "a", altKey: true},
        actionName: "addCommand"
    },
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true},
        actionName: "addCommandToBeginning"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true},
        actionName: "addCommandToEnd"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true},
        actionName: "deleteCurrentStep"
    },
    announceScene: {
        keyDef: { code: "KeyI", key: "i", altKey: true},
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
        keyDef: { code: "KeyP", key: "p", altKey: true},
        actionName: "playPauseProgram"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true},
        actionName: "refreshScene"
    },
    showHide: {
        keyDef: { key: "?"},
        actionName: "showHide"
    },
    stopProgram: {
        keyDef: { code: "KeyS", key: "s", altKey: true},
        actionName: "stopProgram"
    }
}, ExtendedKeyboardSequences);

const ControlAltExtendedKeyboardSequences = extend(ExtendedKeyboardSequences, {
    extraSettings: {
        keyDef: { ctrlKey: true }
    },

    focusChange: {
        keyDef: {ctrlKey: true }
    },

    selectedActionChange: {
        keyDef: { ctrlKey: true }
    },

    characterPosition: {
        keyDef: { ctrlKey: true }
    }
});

const ControlAltInputScheme = Object.assign({
    addCommand: {
        keyDef: { code: "KeyA", key: "a", altKey: true, ctrlKey: true},
        actionName: "addCommand",
        description: "Add action block to a program"
    },
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true, ctrlKey: true},
        actionName: "addCommandToBeginning",
        description: "Add action block to the beginning of the program"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true, ctrlKey: true},
        actionName: "addCommandToEnd",
        description: "Add action block to the end of the program"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true, ctrlKey: true},
        actionName: "deleteCurrentStep",
        description: "Delete the most recent action block added to the program"
    },
    announceScene: {
        keyDef: {code: "KeyI", key: "i", altKey: true, ctrlKey: true},
        actionName: "announceScene",
        description: "Initiate announcement of the scene"
    },
    decreaseProgramSpeed: {
        keyDef: { key: "<", shiftKey: true, hidden: true},
        actionName: "decreaseProgramSpeed",
        description: "Decrease the program speed"
    },
    increaseProgramSpeed: {
        keyDef: { key: ">", shiftKey: true, hidden: true},
        actionName: "increaseProgramSpeed",
        description: "Increase the program speed"
    },
    playPauseProgram: {
        keyDef: { code: "KeyP", key: "p", altKey: true, ctrlKey: true},
        actionName: "playPauseProgram",
        description: "Activate play and pause of the program"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true, ctrlKey: true },
        actionName: "refreshScene",
        description: "Refresh the scene"
    },
    showHide: {
        keyDef: { key: "?", shiftKey: true },
        actionName: "showHide",
        description: "Show or hide keyboard shortcut menu"
    },
    stopProgram: {
        keyDef: {code: "KeyS", key: "s", altKey: true, ctrlKey: true},
        actionName: "stopProgram",
        description: "Stop the program from playing"
    },
}, ControlAltExtendedKeyboardSequences);

export const KeyboardInputSchemes: KeyboardInputSchemesType = {
    "controlalt": ControlAltInputScheme,
    "alt": AltInputScheme
};

const labelMessageKeysByCode = {
    "KeyA": "KeyboardInputModal.KeyLabels.A",
    "KeyB": "KeyboardInputModal.KeyLabels.B",
    "KeyD": "KeyboardInputModal.KeyLabels.D",
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
    "KeyD": "KeyboardInputModal.KeyIcons.D",
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

    if (events.length) {
        for (const singleKeySequence of Object.values(keyboardInputScheme)) {
            if (match === false || match === "partial") {
                // $FlowFixMe: Flow doesn't believe this matches our "or"ed set of allowed inputs.
                const keySequenceMatch = matchSingleInputSchemeLevel(events, singleKeySequence, 0);
                if (keySequenceMatch !== false) {
                    match = keySequenceMatch;
                }
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

export function isRepeatedEvent (firstKeyboardEvent: KeyboardEvent, secondKeyboardEvent: KeyboardEvent) {
    for (const property of ["key", "code", "altKey", "ctrlKey"]) {
        // $FlowFixMe: Flow is confused about the structure of a keyboard event.
        if (firstKeyboardEvent[property] !== secondKeyboardEvent[property]) {
            return false;
        }
    }
    return true;
}
