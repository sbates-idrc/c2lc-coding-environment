// @flow

import type {IntlShape} from 'react-intl';
import type {AudioManager, ProgramStepMovementDirection} from './types';
import {App} from './App';
import {ProgramBlockEditor} from './ProgramBlockEditor';

// The ProgramChangeController is responsible for making changes to the
// App 'state.programSequence' and coordinating any user interface
// activities associated with the change, such as making announcements,
// setting focus, or setting up animations.

type FocusAfterMoveEnum = 'focusBlockMoved' | 'focusActionPanel';

export default class ProgramChangeController {
    app: App;
    intl: IntlShape;
    audioManager: AudioManager;

    constructor(app: App, intl: IntlShape, audioManager: AudioManager) {
        this.app = app;
        this.intl = intl;
        this.audioManager = audioManager;
    }

    insertSelectedActionIntoProgram(programBlockEditor: ?ProgramBlockEditor,
        index: number, selectedAction: ?string) {

        this.app.setState((state) => {
            if (selectedAction) {
                this.playAnnouncementForAdd(selectedAction);
                this.doActivitiesForAdd(programBlockEditor, index);
                return {
                    programSequence: state.programSequence.insertStep(index,
                        selectedAction)
                };
            } else {
                return {};
            }
        });
    }

    addSelectedActionToProgramEnd(programBlockEditor: ?ProgramBlockEditor,
        selectedAction: ?string) {

        this.app.setState((state) => {
            if (selectedAction) {
                this.playAnnouncementForAdd(selectedAction);
                const index = state.programSequence.getProgramLength();
                this.doActivitiesForAdd(programBlockEditor, index);
                return {
                    programSequence: state.programSequence.insertStep(index,
                        selectedAction)
                };
            } else {
                return {};
            }
        });
    }

    deleteProgramStep(programBlockEditor: ?ProgramBlockEditor,
        index: number, command: string) {

        this.app.setState((state) => {
            // Check that the step to delete hasn't changed since the
            // user made the deletion
            const currentStep = state.programSequence.getProgramStepAt(index);
            if (command === currentStep.block) {
                // Play the announcement
                const commandString = this.intl.formatMessage(
                    { id: "Announcement." + command },
                    { loopLabel: currentStep.label }
                );
                this.audioManager.playAnnouncement(
                    'delete',
                    this.intl,
                    { command: commandString }
                );

                if (programBlockEditor) {
                    // If there are steps following the one being deleted, focus
                    // the next step. Otherwise, focus the final add node.
                    if (currentStep.block === 'startLoop') {
                        // On delete of a startLoop, we need to aware of its endLoop block position
                        if (index < state.programSequence.getProgramLength() - 2) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index);
                        }
                    } else if (currentStep.block === 'endLoop') {
                        // On delete of an endLoop, we lose one more index from deleting its startLoop block
                        if (index < state.programSequence.getProgramLength() - 1) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index - 1);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index - 1);
                        }
                    } else {
                        if (index < state.programSequence.getProgramLength() - 1) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index);
                        }
                    }
                }

                return {
                    programSequence: state.programSequence.deleteStep(index)
                };
            } else {
                // If the step to delete has changed, make no changes to the
                // program
                return {};
            }
        });
    }

    moveProgramStep(programBlockEditor: ?ProgramBlockEditor,
        indexFrom: number, direction: ProgramStepMovementDirection, commandAtIndexFrom: string,
        focusAfterMove: FocusAfterMoveEnum) {

        this.app.setState((state) => {
            // Check that the steps at indexFrom has changed
            const stepAtIndexFrom = state.programSequence.getProgramStepAt(indexFrom);
            if (commandAtIndexFrom === stepAtIndexFrom.block) {
                let announcementName = '';
                if (direction === 'next') {
                    announcementName = 'moveToNext';
                } else if (direction === 'previous') {
                    announcementName = 'moveToPrevious';
                }
                // Play the announcement
                this.audioManager.playAnnouncement(
                    announcementName,
                    this.intl
                );

                const program = state.programSequence.getProgram();
                let indexTo = null;
                let indexAfterMove = null;
                let focusedActionPanelOptionName = null;

                if (direction === 'next') {
                    if (program[indexFrom].block === 'startLoop') {
                        const label = program[indexFrom].label;
                        for (let i = indexFrom; i < program.length; i++) {
                            if (program[i].block === 'endLoop' && program[i].label === label) {
                                indexTo = i + 1;
                                break;
                            }
                        }
                    } else {
                        indexTo = indexFrom + 1;
                    }
                    indexAfterMove = indexFrom + 1;
                    focusedActionPanelOptionName = 'moveToNextStep';
                } else if (direction === 'previous') {
                    if (program[indexFrom].block === 'endLoop') {
                        const label = program[indexFrom].label;
                        for (let i = 0; i < indexFrom; i++) {
                            if (program[i].block === 'startLoop' && program[i].label === label) {
                                indexTo = i - 1;
                                break;
                            }
                        }
                    } else {
                        indexTo = indexFrom - 1;
                    }
                    indexAfterMove = indexFrom - 1;
                    focusedActionPanelOptionName = 'moveToPreviousStep';
                }

                // Case 1: move via action panel button
                //     - keep action panel open, focus on button used
                // Case 2: move via shortcut, action panel closed
                //     - focus moved block, keep action panel closed
                // Case 3: move via shortcut, action panel open
                //     - focus moved block, keep action panel open

                if (indexTo != null && indexAfterMove != null) {
                    if (focusAfterMove === 'focusActionPanel') {
                        return {
                            programSequence: state.programSequence.swapStep(indexFrom, indexTo),
                            actionPanelStepIndex: indexAfterMove,
                            actionPanelFocusedOptionName: focusedActionPanelOptionName
                        };
                    } else if (focusAfterMove === 'focusBlockMoved' && state.actionPanelStepIndex == null) {
                        if (programBlockEditor != null) {
                            programBlockEditor.focusCommandBlockAfterUpdate(indexAfterMove);
                        }
                        return {
                            programSequence: state.programSequence.swapStep(indexFrom, indexTo),
                            actionPanelStepIndex: null,
                            actionPanelFocusedOptionName: null
                        };
                    } else if (focusAfterMove === 'focusBlockMoved' && state.actionPanelStepIndex != null) {
                        if (programBlockEditor != null) {
                            programBlockEditor.focusCommandBlockAfterUpdate(indexAfterMove);
                        }
                        return {
                            programSequence: state.programSequence.swapStep(indexFrom, indexTo),
                            actionPanelStepIndex: indexAfterMove,
                            actionPanelFocusedOptionName: null
                        };
                    }
                }
            } else {
                // If the step to move has changed, make no changes to the program
                return {};
            }
        });
    }

    // Internal methods

    playAnnouncementForAdd(command: string) {
        const commandString = this.intl.formatMessage({
            id: "Announcement." + (command || "")
        });
        this.audioManager.playAnnouncement(
            'add',
            this.intl,
            { command: commandString }
        );
    }

    doActivitiesForAdd(programBlockEditor: ?ProgramBlockEditor, index: number) {
        // Set up focus, scrolling, and animation
        if (programBlockEditor) {
            programBlockEditor.focusCommandBlockAfterUpdate(index);
            programBlockEditor.scrollToAddNodeAfterUpdate(index + 1);
            programBlockEditor.setUpdatedCommandBlock(index);
        }
    }

};
