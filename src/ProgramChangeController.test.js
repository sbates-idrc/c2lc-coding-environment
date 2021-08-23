// @flow

import {createIntl} from 'react-intl';
import {App} from './App';
import AudioManagerImpl from './AudioManagerImpl';
import {ProgramBlockEditor} from './ProgramBlockEditor';
import ProgramChangeController from './ProgramChangeController';
import ProgramSequence from './ProgramSequence';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

jest.mock('./App');
jest.mock('./AudioManagerImpl');
jest.mock('./ProgramBlockEditor');

function createProgramChangeContoller() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    AudioManagerImpl.mockClear();

    // $FlowFixMe: Jest mock API
    const controller = new ProgramChangeController(new App(), intl, new AudioManagerImpl());

    // $FlowFixMe: Jest mock API
    const appMock = App.mock.instances[0];
    // $FlowFixMe: Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    return {
        controller,
        appMock,
        audioManagerMock
    };
}

test('Given there is a selectedAction, when insertSelectedCommandIntoProgram() is called, then the program should be updated and all expected activities invoked', (done) => {

    expect.assertions(9);

    const { controller, appMock, audioManagerMock } = createProgramChangeContoller();

    appMock.setState.mockImplementation((callback) => {
        const newState = callback({
            programSequence: new ProgramSequence(['forward1', 'forward2'], 0),
            selectedAction: 'forward3'
        });

        // The program should be updated
        expect(newState.programSequence.getProgram()).toStrictEqual(
            ['forward1', 'forward3', 'forward2']);

        // The announcement should be made
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');

        // The focus, scrolling, and animation should be set up
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
        expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
        expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
        expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
        expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

        done();
    });

    // $FlowFixMe: Jest mock API
    ProgramBlockEditor.mockClear();
    // $FlowFixMe: Jest mock API
    controller.insertSelectedCommandIntoProgram(new ProgramBlockEditor(), 1);
});

test('Given there is no selectedAction, when insertSelectedCommandIntoProgram() is called, then no changes should be made', (done) => {

    expect.assertions(5);

    const { controller, appMock, audioManagerMock } = createProgramChangeContoller();

    appMock.setState.mockImplementation((callback) => {
        const newState = callback({
            programSequence: new ProgramSequence([], 0),
            selectedAction: null
        });

        // The program should not be updated
        expect(newState).toStrictEqual({});

        // No announcement should be made
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

        // No methods on the ProgramBlockEditor should have been called
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
        expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
        expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

        done();
    });

    // $FlowFixMe: Jest mock API
    ProgramBlockEditor.mockClear();
    // $FlowFixMe: Jest mock API
    controller.insertSelectedCommandIntoProgram(new ProgramBlockEditor(), 0);
});

test('When deleteProgramStep() is called on a step not at the end, then focus is set to the step now at the deleted index', (done) => {

    expect.assertions(6);

    const { controller, appMock, audioManagerMock } = createProgramChangeContoller();

    appMock.setState.mockImplementation((callback) => {
        const newState = callback({
            programSequence: new ProgramSequence(['forward1', 'forward2'], 0)
        });

        // The program should be updated
        expect(newState.programSequence.getProgram()).toStrictEqual(
            ['forward2']);

        // The announcement should be made
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');

        // The command block should be focused
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(0);
        expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

        done();
    });

    // $FlowFixMe: Jest mock API
    ProgramBlockEditor.mockClear();
    // $FlowFixMe: Jest mock API
    controller.deleteProgramStep(new ProgramBlockEditor(), 0, 'forward1');
});

test('When deleteProgramStep() is called on the step at the end, then focus is set to the add-node after the program', (done) => {

    expect.assertions(6);

    const { controller, appMock, audioManagerMock } = createProgramChangeContoller();

    appMock.setState.mockImplementation((callback) => {
        const newState = callback({
            programSequence: new ProgramSequence(['forward1', 'forward2'], 0)
        });

        // The program should be updated
        expect(newState.programSequence.getProgram()).toStrictEqual(
            ['forward1']);

        // The announcement should be made
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');

        // The add-node after the program should be focused
        // $FlowFixMe: Jest mock API
        const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
        expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
        expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(1);
        expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls[0][0]).toBe(1);

        done();
    });

    // $FlowFixMe: Jest mock API
    ProgramBlockEditor.mockClear();
    // $FlowFixMe: Jest mock API
    controller.deleteProgramStep(new ProgramBlockEditor(), 1, 'forward2');
});
