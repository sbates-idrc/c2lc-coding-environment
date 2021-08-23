// @flow

import type {IntlShape} from 'react-intl';
import type {AudioManager} from './types';
import {App} from './App';
import {ProgramBlockEditor} from './ProgramBlockEditor';

// The ProgramChangeController is responsible for making changes to the
// App 'state.programSequence' and coordinating any user interface
// activities associated with the change, such as making announcements,
// setting focus, or setting up animations.

export default class ProgramChangeController {
    app: App;
    intl: IntlShape;
    audioManager: AudioManager;

    constructor(app: App, intl: IntlShape, audioManager: AudioManager) {
        this.app = app;
        this.intl = intl;
        this.audioManager = audioManager;
    }

    insertSelectedCommandIntoProgram(programBlockEditor: ?ProgramBlockEditor,
        index: number) {

        this.app.setState((state) => {
            if (state.selectedAction) {
                const selectedAction = state.selectedAction;

                // Play the announcement
                const commandString = this.intl.formatMessage({
                    id: "Announcement." + (selectedAction || "")
                });
                this.audioManager.playAnnouncement(
                    'add',
                    this.intl,
                    { command: commandString}
                );

                // Set up focus, scrolling, and animation
                if (programBlockEditor) {
                    programBlockEditor.focusCommandBlockAfterUpdate(index);
                    programBlockEditor.scrollToAddNodeAfterUpdate(index + 1);
                    programBlockEditor.setUpdatedCommandBlock(index);
                }

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

        // TODO: Check the command

        this.app.setState((state) => {
            // Play the announcement
            const commandString = this.intl.formatMessage({
                id: "Announcement." + command
            });
            this.audioManager.playAnnouncement(
                'delete',
                this.intl,
                { command: commandString }
            );

            // If there are steps following the one being deleted, focus the
            // next step. Otherwise, focus the final add node.
            if (programBlockEditor) {
                if (index < state.programSequence.getProgramLength() - 1) {
                    programBlockEditor.focusCommandBlockAfterUpdate(index);
                } else {
                    programBlockEditor.focusAddNodeAfterUpdate(index);
                }
            }

            return {
                programSequence: state.programSequence.deleteStep(index)
            };
        });
    }

};
