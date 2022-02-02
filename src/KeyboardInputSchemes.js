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
            description: "Turn the audio feedback announcements on or off"
        },
        focusChange: {
            keyDef: {
                code: "KeyF",
                key: "f"
            },
            actions: {
                keyDef: { code: "KeyA", key: "a" },
                actionName: "focusActions",
                description: "Move focus to the actions panel"
            },
            appHeader: {
                keyDef: { code: "KeyH", key: "h" },
                actionName: "focusAppHeader",
                description: "Move focus to the page title"
            },
            addNodeToggle: {
                keyDef: { code: "KeyT", key: "t" },
                actionName: "focusAddNodeToggle",
                description: "Move focus to the add node toggle",
                icon: "A23.png",
                altText: "Focus add node toggle icon"
            },
            characterPositionControls: {
                keyDef: { code: "KeyC", key: "c" },
                actionName: "focusCharacterPositionControls",
                description: "Move focus to the character position controls"
            },
            characterPositionColumnInput: {
                keyDef: { code: "KeyX", key: "x" },
                actionName: "focusCharacterColumnInput",
                description: "Move focus to the character position column input field"
            },
            characterPositionRowInput: {
                keyDef: { code: "KeyX", key: "y" },
                actionName: "focusCharacterRowInput",
                description: "Move focus to the character position row input field"
            },
            // TODO: rename this since we move focus to the play button, not an area
            playShare: {
                keyDef: { code: "KeyP", key: "p" },
                actionName: "focusPlayShare",
                description: "Move focus to the play button"
            },
            programSequence: {
                keyDef: { code: "KeyQ", key: "q" },
                actionName: "focusProgramSequence",
                description: "Move focus to the beginning of the program"
            },
            scene: {
                keyDef: { code: "KeyS", key: "s" },
                actionName: "focusScene",   // TODO: this should be renamed because it no longer focuses the scene
                description: "Move focus to the pen toggle"
            },
            worldSelector: {
                keyDef: { code: "KeyW", key: "w" },
                actionName: "focusWorldSelector",
                description: "Move focus to the world selector",
                icon: "A24.png",
                altText: "Focus world selector icon"
            }
        },

        selectedActionChange: {
            keyDef: { code: "KeyA", key: "a" },
            forward: {
                keyDef: { code: "KeyF", key: "f" },
                forward1: {
                    keyDef: { key: "1"},
                    actionName: "selectForward1",
                    description: "Select the forward 1 square action block",
                    icon: "A10.png",
                    altText: "Select forward 1 icon"
                },
                forward2: {
                    keyDef: { key: "2"},
                    actionName: "selectForward2",
                    description: "Select the forward 2 squares action block"
                },
                forward3: {
                    keyDef: { key: "3"},
                    actionName: "selectForward3",
                    description: "Select the forward 3 squares action block"
                }
            },
            backward: {
                keyDef: { code: "KeyB", key: "b" },
                backward1: {
                    keyDef: { key: "1"},
                    actionName: "selectBackward1",
                    description: "Select the backward 1 square action block",
                    icon: "A11.png",
                    altText: "Select backward 1 icon"
                },
                backward2: {
                    keyDef: { key: "2"},
                    actionName: "selectBackward2",
                    description: "Select the backward 2 squares action block"
                },
                backward3: {
                    keyDef: { key: "3"},
                    actionName: "selectBackward3",
                    description: "Select the backward 3 squares action block"
                }
            },
            left: {
                keyDef: { code: "KeyL", key: "l" },
                left45: {
                    keyDef: { key: "1"},
                    actionName: "selectLeft45",
                    description: "Select the turn left 45 degrees action block",
                    icon: "A12.png",
                    altText: "Select turn left 45 icon"
                },
                left90: {
                    keyDef: { key: "2"},
                    actionName: "selectLeft90",
                    description: "Select the turn left 90 degrees action block",
                    icon: "A13.png",
                    altText: "Select turn left 90 icon"
                },
                left180: {
                    keyDef: { key: "3"},
                    actionName: "selectLeft180",
                    description: "Select the turn left 180 degrees action block"
                }
            },
            right: {
                keyDef: { code: "KeyR", key: "r" },
                right45: {
                    keyDef: { key: "1"},
                    actionName: "selectRight45",
                    description: "Select the turn right 45 degrees action block",
                    icon: "A14.png",
                    altText: "Select turn right 45 icon"
                },
                right90: {
                    keyDef: { key: "2"},
                    actionName: "selectRight90",
                    description: "Select the turn right 90 degrees action block",
                    icon: "A15.png",
                    altText: "Select turn right 90 icon"
                },
                right180: {
                    keyDef: { key: "3"},
                    actionName: "selectRight180",
                    description: "Select the turn right 180 degrees action block"
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
                    description: "Move the character left",
                    icon: "A17.png",
                    altText: "Move character left icon"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "moveCharacterRight",
                    description: "Move the character right",
                    icon: "A18.png",
                    altText: "Move character right icon"
                },
                up: {
                    keyDef: { code: "KeyU", key: "u" },
                    actionName: "moveCharacterUp",
                    description: "Move the character up",
                    icon: "A19.png",
                    altText: "Move character up icon"
                },
                down: {
                    keyDef: { code: "KeyD", key: "d" },
                    actionName: "moveCharacterDown",
                    description: "Move the character down",
                    icon: "A16.png",
                    altText: "Move character down icon"
                }
            },
            turn: {
                keyDef: { code: "KeyT", key: "t" },
                left: {
                    keyDef: { code: "KeyL", key: "l" },
                    actionName: "turnCharacterLeft",
                    description: "Turn the character left 45 degrees",
                    icon: "A20.png",
                    altText: "Turn character left icon"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "turnCharacterRight",
                    description: "Turn the character right 45 degrees",
                    icon: "A21.png",
                    altText: "Turn character right icon"
                }
            }
        },

        changeTheme: {
            keyDef: { code: "KeyT", key: "t" },
            default: {
                keyDef: { key: "1"},
                actionName: "changeToDefaultTheme",
                description: "Change the current visual theme to the default theme",
                icon: "A25.png",
                altText: "Change to default theme icon"
            },
            light: {
                keyDef: { key: "2"},
                actionName: "changeToLightTheme",
                description: "Change the current visual theme to the light theme",
                icon: "A26.png",
                altText: "Change to light theme icon"
            },
            dark: {
                keyDef: { key: "3"},
                actionName: "changeToDarkTheme",
                description: "Change the current visual theme to the dark theme",
                icon: "A27.png",
                altText: "Change to dark theme icon"
            },
            grayscale: {
                keyDef: { key: "4"},
                actionName: "changeToGrayscaleTheme",
                description: "Change the current visual theme to the grayscale theme",
                icon: "A28.png",
                altText: "Change to grayscale theme icon"
            },
            highContrast: {
                keyDef: { key: "5"},
                actionName: "changeToHighContrastTheme",
                description: "Change the current visual theme to the high contrast theme",
                icon: "A29.png",
                altText: "Change to high contrast theme icon"
            }
        },

        deleteAll: {
            keyDef: { code: "KeyD", key: "d" },
            actionName: "deleteAll",
            description: "Delete all the action blocks in the program",
            icon: "A22.png",
            altText: "Delete all icon"
        }
    }
}

const AltInputScheme: KeyboardInputScheme = Object.assign({
    addCommand: {
        keyDef: { code: "KeyA", key: "a", altKey: true},
        actionName: "addCommand",
        description: "Add the selected action block to the program after the focused node or the focused action block",
        icon: "A01.png",
        altText: "Add action icon"
    },
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true},
        actionName: "addCommandToBeginning",
        description: "Add the selected action block to the beginning of the program",
        icon: "A02.png",
        altText: "Add action to start icon"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true},
        actionName: "addCommandToEnd",
        description: "Add the selected action block to the end of the program",
        icon: "A03.png",
        altText: "Add action to end icon"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true},
        actionName: "deleteCurrentStep",
        description: "Delete the focused action block from the program"
    },
    announceScene: {
        keyDef: { code: "KeyI", key: "i", altKey: true},
        actionName: "announceScene",
        description: "Initiate announcement of the scene"
    },
    decreaseProgramSpeed: {
        keyDef: { key: "<", hidden: true},
        actionName: "decreaseProgramSpeed",
        description: "Decrease the program speed",
        icon: "A07.png",
        altText: "Decrease speed icon"
    },
    increaseProgramSpeed: {
        keyDef: { key: ">", hidden: true},
        actionName: "increaseProgramSpeed",
        description: "Increase the program speed",
        icon: "A08.png",
        altText: "Increase speed icon"
    },
    playPauseProgram: {
        keyDef: { code: "KeyP", key: "p", altKey: true},
        actionName: "playPauseProgram",
        description: "Play or pause the program",
        icon: "A04.png",
        altText: "Play or pause program icon"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true},
        actionName: "refreshScene",
        description: "Refresh the scene",
        icon: "A05.png",
        altText: "Refresh scene icon"
    },
    // TODO: This should be renamed because it doesn't hide the dialog -
    //       keyboard shortcuts are disabled when dialogs are open.
    //       We should also add 'esc' to the docs as a shortcut for closing dialogs.
    showHide: {
        keyDef: { key: "?"},
        actionName: "showHide",
        description: "Show the keyboard shortcuts menu",
        icon: "A09.png",
        altText: "Show keyboard shortcuts menu icon"
    },
    stopProgram: {
        keyDef: { code: "KeyS", key: "s", altKey: true},
        actionName: "stopProgram",
        description: "Stop the program from playing",
        icon: "A06.png",
        altText: "Stop program icon"
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

const ControlAltInputScheme = extend (AltInputScheme, {
    addCommand: {
        keyDef: { code: "KeyA", key: "a", altKey: true, ctrlKey: true}
    },
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true, ctrlKey: true}
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true, ctrlKey: true}
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true, ctrlKey: true}
    },
    announceScene: {
        keyDef: {code: "KeyI", key: "i", altKey: true, ctrlKey: true}
    },
    decreaseProgramSpeed: {
        keyDef: { key: "<", shiftKey: true, hidden: true}
    },
    increaseProgramSpeed: {
        keyDef: { key: ">", shiftKey: true, hidden: true}
    },
    playPauseProgram: {
        keyDef: { code: "KeyP", key: "p", altKey: true, ctrlKey: true}
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true, ctrlKey: true }
    },
    showHide: {
        keyDef: { key: "?", shiftKey: true }
    },
    stopProgram: {
        keyDef: {code: "KeyS", key: "s", altKey: true, ctrlKey: true}
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
