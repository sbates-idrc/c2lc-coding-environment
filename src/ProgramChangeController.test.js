// @flow

import {createIntl} from 'react-intl';
import {App} from './App';
import AudioManagerImpl from './AudioManagerImpl';
import {ProgramBlockEditor} from './ProgramBlockEditor';
import ProgramChangeController from './ProgramChangeController';
import ProgramSequence from './ProgramSequence';
import type { Program } from './types';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

jest.mock('./App');
jest.mock('./AudioManagerImpl');
jest.mock('./ProgramBlockEditor');

function createProgramChangeController() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    AudioManagerImpl.mockClear();
    // $FlowFixMe: Jest mock API
    const appMock = new App();
    // $FlowFixMe: Jest mock API
    const audioManagerMock = new AudioManagerImpl();

    const controller = new ProgramChangeController(appMock, audioManagerMock);

    return {
        controller,
        appMock,
        audioManagerMock
    };
}

describe('Test insertSelectedActionIntoProgram()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'forward3'}, {block: 'forward2'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                actionType: 'movement',
                actionName: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

            done();
        });

        controller.insertSelectedActionIntoProgram(programBlockEditorMock, 1,
            'forward3', intl);
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        controller.insertSelectedActionIntoProgram(programBlockEditorMock, 0, null, intl);
    });
});

describe('Test addSelectedActionToProgramEnd()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                actionType: 'movement',
                actionName: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(3);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(2);

            done();
        });

        controller.addSelectedActionToProgramEnd(programBlockEditorMock, 'forward3', intl);
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        controller.addSelectedActionToProgramEnd(programBlockEditorMock, null, intl);
    });
});

type DeleteStepTestCase = {
    program: Program,
    deleteStepIndex: number,
    deleteStepName: string,
    expectedAnnouncementActionType: string,
    expectedAnnouncementActionName: string
};

describe('Test deleteProgramStep()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 0,
            deleteStepName: 'forward1',
            expectedAnnouncementActionType: 'movement',
            expectedAnnouncementActionName: 'forward 1 square'
        },
        {
            program: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'forward2'},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 0,
            deleteStepName: 'startLoop',
            expectedAnnouncementActionType: 'control',
            expectedAnnouncementActionName: 'loop A'
        },
        {
            program: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'endLoop',
            expectedAnnouncementActionType: 'control',
            expectedAnnouncementActionName: 'loop A'
        }
    ]: Array<DeleteStepTestCase>))('When deleting a step not at the end, then focus is set to the step now at the deleted index',
        (testData: DeleteStepTestCase, done) => {
            expect.assertions(7);

            const { controller, appMock, audioManagerMock } = createProgramChangeController();

            // $FlowFixMe: Jest mock API
            ProgramBlockEditor.mockClear();
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = new ProgramBlockEditor();

            appMock.setState.mockImplementation((updater) => {
                const newState = updater({
                    programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
                });

                // The program should be updated
                expect(newState.programSequence.getProgram()).toStrictEqual(
                    [{block: 'forward2'}]);

                // The announcement should be made
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
                expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                    actionType: testData.expectedAnnouncementActionType,
                    actionName: testData.expectedAnnouncementActionName
                });

                // The add-node after the program should be focused
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(0);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

                done();
            });

            controller.deleteProgramStep(programBlockEditorMock, testData.deleteStepIndex, testData.deleteStepName, intl);
        });

    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'forward2',
            expectedAnnouncementActionType: 'movement',
            expectedAnnouncementActionName: 'forward 2 squares'
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'startLoop',
            expectedAnnouncementActionType: 'control',
            expectedAnnouncementActionName: 'loop A'
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 2,
            deleteStepName: 'endLoop',
            expectedAnnouncementActionType: 'control',
            expectedAnnouncementActionName: 'loop A'
        }
    ]: Array<DeleteStepTestCase>))('When deleting the step at the end, then focus is set to the add-node after the program',
        (testData: DeleteStepTestCase, done) => {
            expect.assertions(7);

            const { controller, appMock, audioManagerMock } = createProgramChangeController();

            // $FlowFixMe: Jest mock API
            ProgramBlockEditor.mockClear();
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = new ProgramBlockEditor();

            appMock.setState.mockImplementation((updater) => {
                const newState = updater({
                    programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
                });

                // The program should be updated
                expect(newState.programSequence.getProgram()).toStrictEqual(
                    [{block: 'forward1'}]);

                // The announcement should be made
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
                expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                    actionType: testData.expectedAnnouncementActionType,
                    actionName: testData.expectedAnnouncementActionName
                });

                // The add-node after the program should be focused
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(1);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls[0][0]).toBe(1);

                done();
            });

            controller.deleteProgramStep(programBlockEditorMock, testData.deleteStepIndex, testData.deleteStepName, intl);
        });

    test('When the step to delete has changed, then no changes to the program should be made', (done) => {
        expect.assertions(4);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

            done();
        });

        controller.deleteProgramStep(programBlockEditorMock, 1, 'forward3', intl);
    });

});

describe('Test replaceProgramStep()', () => {
    test('When there is no selectedAction, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'left45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('noActionSelected');

            done();
        });

        controller.replaceProgramStep(programBlockEditorMock, 1, null, intl);
    });

    test('When the block to replace is a loop block, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence(
                    [
                        {
                            block: 'startLoop',
                            label: 'A',
                            iterations: 1
                        },
                        {
                            block: 'endLoop',
                            label: 'A'
                        }
                    ],
                    0,
                    0,
                    new Map()
                )
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotReplaceLoopBlocks');

            done();
        });

        controller.replaceProgramStep(programBlockEditorMock, 1, 'right45', intl);
    });

    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'left45'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'right45'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('replace');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                oldActionName: "turn left 45 degrees",
                newActionName: "turn right 45 degrees"
            });

            // The focus, scrolling, and animation should be set up
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

            done();
        });

        controller.replaceProgramStep(programBlockEditorMock, 1, 'right45', intl);
    });
});

describe('Test moveProgramStepNext()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            indexFrom: 0,
            commandAtIndexFrom: 'forward1',
            focusAfterMove: 'focusBlockMoved',
            expectedProgram: [
                {block: 'forward2'},
                {block: 'forward1'}
            ],
            expectedAnnouncementAction: 'moveToNext',
            expectedFocusCommandBlockAfterUpdateCall: 1
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            indexFrom: 1,
            commandAtIndexFrom: 'startLoop',
            focusAfterMove: 'focusActionPanel',
            expectedProgram: [
                {block: 'forward1'},
                {block: 'forward2'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
            ],
            expectedAnnouncementAction: 'moveToNext',
            expectedFocusCommandBlockAfterUpdateCall: 0
        }
    ]))('When movement is possible, then the program should be updated and all expected activities invoked', (testData, done) => {
        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(testData.expectedProgram);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe(testData.expectedAnnouncementAction);

            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(testData.expectedFocusCommandBlockAfterUpdateCall);

            done();
        });

        controller.moveProgramStepNext(programBlockEditorMock,
            testData.indexFrom, testData.commandAtIndexFrom,
            testData.focusAfterMove,
            intl);
    });

    test('When move next is not possible, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotMoveNext');

            done();
        });

        controller.moveProgramStepNext(programBlockEditorMock, 1, 'right45', 'focusBlockMoved', intl);
    });
});

describe('Test moveProgramStepPrevious()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            indexFrom: 1,
            commandAtIndexFrom: 'forward2',
            focusAfterMove: 'focusBlockMoved',
            expectedProgram: [
                {block: 'forward2'},
                {block: 'forward1'}
            ],
            expectedAnnouncementAction: 'moveToPrevious',
            expectedFocusCommandBlockAfterUpdateCall: 1
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            indexFrom: 2,
            commandAtIndexFrom: 'endLoop',
            focusAfterMove: 'focusActionPanel',
            expectedProgram: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            expectedAnnouncementAction: 'moveToPrevious',
            expectedFocusCommandBlockAfterUpdateCall: 0
        },
    ]))('When movement is possible, then the program should be updated and all expected activities invoked', (testData, done) => {
        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(testData.expectedProgram);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe(testData.expectedAnnouncementAction);

            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(testData.expectedFocusCommandBlockAfterUpdateCall);

            done();
        });

        controller.moveProgramStepPrevious(programBlockEditorMock,
            testData.indexFrom, testData.commandAtIndexFrom,
            testData.focusAfterMove,
            intl);
    });

    test('When move previous is not possible, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = new ProgramBlockEditor();

        appMock.setState.mockImplementation((updater) => {
            const newState = updater({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotMovePrevious');

            done();
        });

        controller.moveProgramStepPrevious(programBlockEditorMock, 0, 'forward1', 'focusBlockMoved', intl);
    });
});
