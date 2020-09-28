// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import AudioManager from './AudioManager';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import FocusTrapManager from './FocusTrapManager';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';
import ToggleSwitch from './ToggleSwitch';

// Mocks
jest.mock('./AudioManager');

configure({ adapter: new Adapter()});

// TODO: Mock the FocusTrapManager

const defaultProgramBlockEditorProps = {
    program: ['forward', 'left', 'forward', 'left'],
    interpreterIsRunning: false,
    activeProgramStepNum: null,
    actionPanelStepIndex: null,
    selectedAction: null,
    editingDisabled: false,
    replaceIsActive: false,
    isDraggingCommand: false,
    focusTrapManager: new FocusTrapManager(),
    addNodeExpandedMode: false
};

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManager.mockClear();
    const audioManagerInstance = new AudioManager(true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock: any = AudioManager.mock.instances[0];

    const mockChangeProgramHandler = jest.fn();

    const mockChangeAddNodeExpandedModeHandler = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    audioManager: audioManagerInstance,
                    onChangeProgram: mockChangeProgramHandler,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        audioManagerMock,
        mockChangeProgramHandler,
        mockChangeAddNodeExpandedModeHandler
    };
}

function createMountProgramBlockEditor(props) {
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManager.mockClear();
    const audioManagerInstance = new AudioManager(true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManager.mock.instances[0];

    const mockChangeProgramHandler = jest.fn();
    const mockChangeActionPanelStepIndex = jest.fn();
    const mockChangeAddNodeExpandedModeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    audioManager: audioManagerInstance,
                    onChangeProgram: mockChangeProgramHandler,
                    onChangeActionPanelStepIndex: mockChangeActionPanelStepIndex,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper,
        audioManagerMock,
        mockChangeProgramHandler,
        mockChangeActionPanelStepIndex,
        mockChangeAddNodeExpandedModeHandler
    };
}

function getProgramDeleteAllButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-deleteAll-button');
}

function getProgramBlockWithActionPanel(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('div')
        .filter('.ProgramBlockEditor__program-block-with-panel');
}

function getActionPanelActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ActionPanel__action-buttons');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index);
}

function getAddNodeButtonAtPosition(programBlockEditorWrapper, index: number) {
    const addNodeButton = programBlockEditorWrapper.find('.AddNode__expanded-button');
    return addNodeButton.at(0);
}

function getExpandAddNodeToggleSwitch(programBlockEditorWrapper) {
    const toggleSwitch = programBlockEditorWrapper.find(ToggleSwitch).filter('.ProgramBlockEditor__add-node-toggle-switch');
    return toggleSwitch.at(0);
}

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(4);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left');
    });
});

test('When a step is clicked, action panel should render next to the step', () => {
    expect.assertions(12);
    for (let stepNum = 0; stepNum < 4; stepNum++) {
        const { wrapper, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
        const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
        programBlock.simulate('click');
        expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
        const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
        expect(actionPanelStepIndex).toBe(stepNum);
        wrapper.setProps({actionPanelStepIndex});
        const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
        // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
        expect(actionPanelContainer.contains(ActionPanel)).toBe(true);
    }
});

describe('The expand add node toggle switch is wired up', () => {
    describe('Given that addNodeExpandedMode is false', () => {
        test('Then the toggle switch should be off, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createShallowProgramBlockEditor({
                addNodeExpandedMode: false
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(false);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);
        });
    });
    describe('Given that addNodeExpandedMode is true', () => {
        test('Then the toggle switch should be on, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createShallowProgramBlockEditor({
                addNodeExpandedMode: true
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(true);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);
        });
    });
});

describe('Delete All button', () => {
    test('When the Delete All button is clicked, then the dialog shoud be shown', () => {
        expect.assertions(4);

        const { wrapper, audioManagerMock } = createShallowProgramBlockEditor();

        // Initially, check that the modal is not showing
        expect(wrapper.state().showConfirmDeleteAll).toBe(false);
        // When the Delete All button is clicked
        const deleteAllButton = getProgramDeleteAllButton(wrapper).at(0);
        deleteAllButton.simulate('click');
        // Then the 'deleteAll' sound should be played
        expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('deleteAll');
        // And the dialog should be shown
        expect(wrapper.state().showConfirmDeleteAll).toBe(true);
    });
});

describe('Delete program steps', () => {
    test.each([
        [ 0, ['left', 'forward', 'left']],
        [ 3, ['forward', 'left', 'forward']]
    ])('While the action panel is open, when block %i is clicked, then program should be updated',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const deleteStepButton = getActionPanelActionButtons(wrapper).at(0);
            deleteStepButton.simulate('click');

            // The 'delete' sound should be played
            expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
            expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('delete');

            // The program should be updated
            expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
            expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
        }
    );
});

describe('Replace program steps', () => {
    test.each([
        [ 0, ['right', 'left', 'forward', 'left'], 'right'],
        [ 0, ['forward', 'left', 'forward', 'left'], null]
    ]) ('Replace a program if selectedAction is not null',
        (stepNum, expectedProgram, selectedAction) => {
            expect.assertions(7);
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor({
                selectedAction
            });
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const replaceButton = getActionPanelActionButtons(wrapper).at(1);
            replaceButton.simulate('click');

            // The 'replace' sound should be played
            expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
            expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('replace');

            // The program should be updated
            if (selectedAction) {
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    );
});

describe('Move to previous program step', () => {
    test.each([
        [ 0, ['forward', 'left', 'forward', 'left']],
        [ 2, ['forward', 'forward', 'left', 'left']]
    ]) ('Changes position with a step before, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveToPreviousButton = getActionPanelActionButtons(wrapper).at(2);
            moveToPreviousButton.simulate('click');

            if (stepNum > 0) {
                // The 'mockToPrevious' sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
                expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('moveToPrevious');
                // The program should be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                // No sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Move to next program step', () => {
    test.each([
        [ 0, ['left', 'forward', 'forward', 'left']],
        [ 3, ['forward', 'left', 'forward', 'left']]
    ]) ('Changes position with a step after, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveToNextButton = getActionPanelActionButtons(wrapper).at(3);
            moveToNextButton.simulate('click');

            if (stepNum < 3) {
                // The 'mockToNext' sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
                expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('moveToNext');
                // The program should be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                // No sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Delete All button can be disabled', () => {
    describe('Given editing is enabled', () => {
        test('Then the buttons should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: false
            });
            expect(getProgramDeleteAllButton(wrapper).get(0).props.disabled).toBe(false);
        });
    });

    describe('Given editing is disabled', () => {
        test('Then the buttons should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: true
            });
            expect(getProgramDeleteAllButton(wrapper).get(0).props.disabled).toBe(true);
        });
    });
});

describe('Scroll to show the active program step', () => {
    test.each([
        1,
        2
    ])('When active program step number is set to %i, then the editor should scroll to the step',
        (stepNum) => {
            expect.assertions(4);

            const mockScrollIntoView = jest.fn();

            window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

            const { wrapper } = createMountProgramBlockEditor();

            wrapper.setProps({
                activeProgramStepNum: stepNum
            });

            expect(mockScrollIntoView.mock.calls.length).toBe(1);
            expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });

            expect(mockScrollIntoView.mock.instances.length).toBe(1);
            expect(mockScrollIntoView.mock.instances[0]).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());
        }
    );
});

test('The editor scrolls when a step is added to the end of the program', () => {
    expect.assertions(8);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'forward' as the selected command
    const { wrapper, audioManagerMock, mockChangeProgramHandler } = createMountProgramBlockEditor({
        program: ['forward', 'forward', 'forward', 'forward', 'forward'],
        selectedAction: 'forward'
    });

    // When 'forward' is added to the end of the program
    const addNode = getAddNodeButtonAtPosition(wrapper, 5);
    addNode.simulate('click');

    // Then the 'add' sound should be played
    expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
    expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('add');

    // And the program should be changed
    expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
    expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(
        ['forward', 'forward', 'forward', 'forward', 'forward', 'forward']);

    // And updating the program triggers auto scroll
    wrapper.setProps({ program: mockChangeProgramHandler.mock.calls[0][0] });
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
    expect(mockScrollIntoView.mock.instances.length).toBe(1);
    expect(mockScrollIntoView.mock.instances[0]).toBe(getAddNodeButtonAtPosition(wrapper, 6).getDOMNode());
});
