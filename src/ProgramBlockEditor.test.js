// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import { IntlProvider } from 'react-intl';
import AudioManagerImpl from './AudioManagerImpl';
import ActionPanel from './ActionPanel';
import AddNode from './AddNode';
import AriaDisablingButton from './AriaDisablingButton';
import CharacterState from './CharacterState';
import CommandBlock from './CommandBlock';
import FocusTrapManager from './FocusTrapManager';
import ProgramBlockCache from './ProgramBlockCache';
import ProgramSequence from './ProgramSequence';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';
import ToggleSwitch from './ToggleSwitch';
import IconButton from './IconButton';

// Mocks
jest.mock('./AudioManagerImpl');

configure({ adapter: new Adapter()});

// TODO: Mock the FocusTrapManager

const defaultProgramBlockEditorProps = {
    interpreterIsRunning: false,
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100)),
    programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'left45'}, {block: 'forward1'}, {block: 'left45'}], 0, 0, new Map()),
    runningState: 'stopped',
    keyboardInputSchemeName: 'controlalt',
    actionPanelStepIndex: null,
    selectedAction: null,
    editingDisabled: false,
    replaceIsActive: false,
    isDraggingCommand: false,
    focusTrapManager: new FocusTrapManager(),
    addNodeExpandedMode: false,
    theme: 'default',
    disallowedActions: {},
    world: 'Sketchpad',
    scrollRightPaddingPx: 0,
    scrollLeftPaddingPx: 0,
    scrollTimeThresholdMs: 0
};

function createMountProgramBlockEditor(props) {
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManagerImpl.mockClear();
    const audioManagerInstance = new AudioManagerImpl(true, true, true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    const mockChangeProgramSequenceHandler = jest.fn();
    const mockInsertSelectedActionIntoProgramHandler = jest.fn();
    const mockDeleteProgramStepHandler = jest.fn();
    const mockReplaceProgramStepHandler = jest.fn();
    const mockMoveProgramStepNextHandler = jest.fn();
    const mockMoveProgramStepPreviousHandler = jest.fn();
    const mockChangeActionPanelStepIndexAndOption = jest.fn();
    const mockChangeAddNodeExpandedModeHandler = jest.fn();

    const programBlockEditorRef = React.createRef();

    const wrapper = mount(
        // $FlowFixMe: Ignore complaint about 'ref'
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    ref: programBlockEditorRef,
                    audioManager: audioManagerInstance,
                    onChangeProgramSequence: mockChangeProgramSequenceHandler,
                    onInsertSelectedActionIntoProgram: mockInsertSelectedActionIntoProgramHandler,
                    onDeleteProgramStep: mockDeleteProgramStepHandler,
                    onReplaceProgramStep: mockReplaceProgramStepHandler,
                    onMoveProgramStepNext: mockMoveProgramStepNextHandler,
                    onMoveProgramStepPrevious: mockMoveProgramStepPreviousHandler,
                    onChangeActionPanelStepIndexAndOption: mockChangeActionPanelStepIndexAndOption,
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
        programBlockEditorRef,
        audioManagerMock,
        mockChangeProgramSequenceHandler,
        mockInsertSelectedActionIntoProgramHandler,
        mockDeleteProgramStepHandler,
        mockReplaceProgramStepHandler,
        mockMoveProgramStepNextHandler,
        mockMoveProgramStepPreviousHandler,
        mockChangeActionPanelStepIndexAndOption,
        mockChangeAddNodeExpandedModeHandler
    };
}

function confirmDeleteAllModalIsOpen(programBlockEditorWrapper): boolean {
    return programBlockEditorWrapper.exists('.Modal__container.active #ConfirmDeleteAllModal');
}

function getProgramDeleteAllButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(IconButton)
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

function getProgramBlockLoopLabel(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
        .find('.command-block-loop-label-container').getDOMNode().textContent;
}

function getProgramBlockLoopIterationsInput(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
        .find('.command-block-loop-iterations');
}

function getProgramBlockLoopIterationsInputValue(programBlockEditorWrapper, index: number) {
    return ((getProgramBlocks(programBlockEditorWrapper).at(index)
        .find('.command-block-loop-iterations')
        .getDOMNode(): any): HTMLInputElement).value;
}

function getAddNodeButtonAtPosition(programBlockEditorWrapper, index: number) {
    const addNodeButton = programBlockEditorWrapper.find(AriaDisablingButton).filter('.AddNode__expanded-button');
    return addNodeButton.at(index);
}

function getExpandAddNodeToggleSwitch(programBlockEditorWrapper) {
    const toggleSwitch = programBlockEditorWrapper.find(ToggleSwitch).filter('.ProgramBlockEditor__add-node-toggle-switch');
    return toggleSwitch.at(0);
}

function getProgramSequenceContainer(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('.ProgramBlockEditor__program-sequence-scroll-container').get(0);
}

function hasLoopContainerActiveClass(wrapper) {
    return wrapper.hasClass('ProgramBlockEditor__loopContainer--active');
}

function hasLoopContainerActiveOutlineClass(wrapper) {
    return wrapper.hasClass('ProgramBlockEditor__loopContainer-active-outline');
}

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(4);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward1');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left45');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward1');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left45');
    });
    test('Loop blocks should render with additional properties about specific loops', () => {
        expect.assertions(7);
        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 2},
                    {block: 'endLoop', label: 'A'}
                ],
                0,
                0,
                new Map([['A', 1]])
            ),
            runningState: 'paused'
        });
        expect(getProgramBlocks(wrapper).length).toBe(2);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('startLoop');
        expect(getProgramBlockLoopLabel(wrapper, 0)).toBe('A');
        expect(getProgramBlockLoopIterationsInputValue(wrapper, 0)).toBe('1');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('endLoop');
        expect(getProgramBlockLoopLabel(wrapper, 1)).toBe('A');
        wrapper.setProps({ runningState: 'stopped' });
        expect(getProgramBlockLoopIterationsInputValue(wrapper, 0)).toBe('2');
    });
    test('Loop blocks should be wrapped in a container', () => {
        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 2
                    },
                    {
                        block: 'forward1',
                        cache: new ProgramBlockCache('A', 1)
                    },
                    {
                        block: 'startLoop',
                        label: 'B',
                        iterations: 2,
                        cache: new ProgramBlockCache('A', 2)
                    },
                    {
                        block: 'left45',
                        cache: new ProgramBlockCache('B', 3)
                    },
                    {
                        block: 'endLoop',
                        label: 'B',
                        cache: new ProgramBlockCache('A', 4)
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    },
                    {
                        block: 'right45'
                    }
                ],
                0,
                0,
                new Map([['A', 2], ['B', 2]])
            )
        });

        const nodes = wrapper.findWhere((node) => {
            return node.hasClass('ProgramBlockEditor__loopContainer')
                || node.type() === CommandBlock
                || node.type() === AddNode;
        });

        expect(nodes.length).toBe(17);

        // 0: AddNode
        expect(nodes.at(0).type()).toBe(AddNode);
        expect(nodes.at(0).prop('programStepNumber')).toBe(0);

        // 1: loopContainer for loop A
        expect(nodes.at(1).type()).toBe('div');
        expect(nodes.at(1).hasClass('ProgramBlockEditor__loopContainer')).toBe(true);
        expect(nodes.at(1).hasClass('ProgramBlockEditor__loopContainer--nested')).toBe(false);

        // 2: startLoop A
        expect(nodes.at(2).type()).toBe(CommandBlock);
        expect(nodes.at(2).prop('data-stepnumber')).toBe(0);
        expect(nodes.at(2).prop('data-command')).toBe('startLoop');
        expect(nodes.at(2).prop('loopLabel')).toBe('A');

        // 3: AddNode
        expect(nodes.at(3).type()).toBe(AddNode);
        expect(nodes.at(3).prop('programStepNumber')).toBe(1);

        // 4: forward1
        expect(nodes.at(4).type()).toBe(CommandBlock);
        expect(nodes.at(4).prop('data-stepnumber')).toBe(1);
        expect(nodes.at(4).prop('data-command')).toBe('forward1');

        // 5: AddNode
        expect(nodes.at(5).type()).toBe(AddNode);
        expect(nodes.at(5).prop('programStepNumber')).toBe(2);

        // 6: loopContainer for loop B
        expect(nodes.at(6).type()).toBe('div');
        expect(nodes.at(6).hasClass('ProgramBlockEditor__loopContainer')).toBe(true);
        expect(nodes.at(6).hasClass('ProgramBlockEditor__loopContainer--nested')).toBe(true);

        // 7: startLoop B
        expect(nodes.at(7).type()).toBe(CommandBlock);
        expect(nodes.at(7).prop('data-stepnumber')).toBe(2);
        expect(nodes.at(7).prop('data-command')).toBe('startLoop');
        expect(nodes.at(7).prop('loopLabel')).toBe('B');

        // 8: AddNode
        expect(nodes.at(8).type()).toBe(AddNode);
        expect(nodes.at(8).prop('programStepNumber')).toBe(3);

        // 9: left45
        expect(nodes.at(9).type()).toBe(CommandBlock);
        expect(nodes.at(9).prop('data-stepnumber')).toBe(3);
        expect(nodes.at(9).prop('data-command')).toBe('left45');

        // 10: AddNode
        expect(nodes.at(10).type()).toBe(AddNode);
        expect(nodes.at(10).prop('programStepNumber')).toBe(4);

        // 11: endLoop B
        expect(nodes.at(11).type()).toBe(CommandBlock);
        expect(nodes.at(11).prop('data-stepnumber')).toBe(4);
        expect(nodes.at(11).prop('data-command')).toBe('endLoop');

        // 12: AddNode
        expect(nodes.at(12).type()).toBe(AddNode);
        expect(nodes.at(12).prop('programStepNumber')).toBe(5);

        // 13: endLoop A
        expect(nodes.at(13).type()).toBe(CommandBlock);
        expect(nodes.at(13).prop('data-stepnumber')).toBe(5);
        expect(nodes.at(13).prop('data-command')).toBe('endLoop');

        // 14: AddNode
        expect(nodes.at(14).type()).toBe(AddNode);
        expect(nodes.at(14).prop('programStepNumber')).toBe(6);

        // 15: right45
        expect(nodes.at(15).type()).toBe(CommandBlock);
        expect(nodes.at(15).prop('data-stepnumber')).toBe(6);
        expect(nodes.at(15).prop('data-command')).toBe('right45');

        // 16: AddNode
        expect(nodes.at(16).type()).toBe(AddNode);
        expect(nodes.at(16).prop('programStepNumber')).toBe(7);

        // Check that the loop A contents are contained in the loop A container
        expect(nodes.at(1).contains(nodes.get(2))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(3))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(4))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(5))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(6))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(12))).toBe(true);
        expect(nodes.at(1).contains(nodes.get(13))).toBe(true);

        // Check that the loop B contents are contained in the loop B container
        expect(nodes.at(6).contains(nodes.get(7))).toBe(true);
        expect(nodes.at(6).contains(nodes.get(8))).toBe(true);
        expect(nodes.at(6).contains(nodes.get(9))).toBe(true);
        expect(nodes.at(6).contains(nodes.get(10))).toBe(true);
        expect(nodes.at(6).contains(nodes.get(11))).toBe(true);

        // Check that the remaining nodes are outside the loop A container
        expect(nodes.at(1).contains(nodes.get(0))).toBe(false);
        expect(nodes.at(1).contains(nodes.get(14))).toBe(false);
        expect(nodes.at(1).contains(nodes.get(15))).toBe(false);
        expect(nodes.at(1).contains(nodes.get(16))).toBe(false);
    });
});

test('When a step is clicked, action panel should render next to the step', () => {
    expect.assertions(16);
    for (let stepNum = 0; stepNum < 4; stepNum++) {
        const { wrapper, mockChangeActionPanelStepIndexAndOption } = createMountProgramBlockEditor();
        const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
        programBlock.simulate('click');
        expect(mockChangeActionPanelStepIndexAndOption.mock.calls.length).toBe(1);
        const actionPanelStepIndex = mockChangeActionPanelStepIndexAndOption.mock.calls[0][0];
        expect(actionPanelStepIndex).toBe(stepNum);
        // Verify that no focused option is set at open
        expect(mockChangeActionPanelStepIndexAndOption.mock.calls[0][1]).toBeNull();
        wrapper.setProps({actionPanelStepIndex});
        const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
        // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
        expect(actionPanelContainer.contains(ActionPanel)).toBe(true);
    }
});

test('Loop container should have focus style when its start or end loop block is focused', () => {
    expect.assertions(3);
    const { wrapper } = createMountProgramBlockEditor({
        programSequence: new ProgramSequence(
            [
                {block: 'startLoop', label: 'A', iterations: 2},
                {block: 'endLoop', label: 'A'}
            ],
            0,
            0,
            new Map([['A', 2]])
        )
    });
    expect(wrapper.html()).not.toContain('ProgramBlockEditor__loopContainer--focused');
    const startLoopBlock = getProgramBlockAtPosition(wrapper, 0);
    startLoopBlock.simulate('focus');
    expect(wrapper.html()).toContain('ProgramBlockEditor__loopContainer--focused');
    startLoopBlock.simulate('blur');
    expect(wrapper.html()).not.toContain('ProgramBlockEditor__loopContainer--focused');
});

describe('Active loop container highlight', () => {
    test.each([
        [ 0, false, false, false, false, false, false ],
        [ 1, true,  true,  false, false, false, false ],
        [ 2, true,  true,  false, false, false, false ],
        [ 3, true,  false, true,  true,  false, false ],
        [ 4, true,  false, true,  true,  false, false ],
        [ 5, true,  false, true,  true,  false, false ],
        [ 6, true,  true,  false, false, false, false ],
        [ 7, false, false, false, false, false, false ],
        [ 8, false, false, false, false, true,  true  ],
        [ 9, false, false, false, false, true,  true  ]
    ]) ('Loop container should have active style when the program is running and the program counter is within the container; and outline style on the closet loop',
        (programCounter, aActive, aOutline, bActive, bOutline, cActive, cOutline) => {
            const { wrapper } = createMountProgramBlockEditor({
                runningState: 'running',
                programSequence: new ProgramSequence(
                    [
                        {block: 'forward1'},
                        {block: 'startLoop', label: 'A', iterations: 2},
                        {block: 'forward1'},
                        {block: 'startLoop', label: 'B', iterations: 2},
                        {block: 'forward1'},
                        {block: 'endLoop', label: 'B'},
                        {block: 'endLoop', label: 'A'},
                        {block: 'forward1'},
                        {block: 'startLoop', label: 'C', iterations: 2},
                        {block: 'endLoop', label: 'C'}
                    ],
                    programCounter,
                    0,
                    new Map([['A', 2], ['B', 2], ['C', 2]])
                )
            });
            const loopContainers = wrapper.find('.ProgramBlockEditor__loopContainer');
            expect(loopContainers.length).toBe(3);
            // Loop A
            expect(hasLoopContainerActiveClass(loopContainers.at(0))).toBe(aActive);
            expect(hasLoopContainerActiveOutlineClass(loopContainers.at(0))).toBe(aOutline);
            // Loop B
            expect(hasLoopContainerActiveClass(loopContainers.at(1))).toBe(bActive);
            expect(hasLoopContainerActiveOutlineClass(loopContainers.at(1))).toBe(bOutline);
            // Loop C
            expect(hasLoopContainerActiveClass(loopContainers.at(2))).toBe(cActive);
            expect(hasLoopContainerActiveOutlineClass(loopContainers.at(2))).toBe(cOutline);
        }
    );
    test('Loop container should have active style when the program is paused and the program counter is within the container', () => {
        const { wrapper } = createMountProgramBlockEditor({
            runningState: 'paused',
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 2},
                    {block: 'endLoop', label: 'A'},
                    {block: 'forward1'}
                ],
                0,
                0,
                new Map([['A', 2]])
            )
        });
        const loopContainers = wrapper.find('.ProgramBlockEditor__loopContainer');
        expect(loopContainers.length).toBe(1);
        expect(hasLoopContainerActiveClass(loopContainers.at(0))).toBe(true);
        expect(hasLoopContainerActiveOutlineClass(loopContainers.at(0))).toBe(true);
    });
    test('Loop container should not have active style when the program is not running', () => {
        const { wrapper } = createMountProgramBlockEditor({
            runningState: 'stopped',
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 2},
                    {block: 'endLoop', label: 'A'},
                    {block: 'forward1'}
                ],
                0,
                0,
                new Map([['A', 2]])
            )
        });
        const loopContainers = wrapper.find('.ProgramBlockEditor__loopContainer');
        expect(loopContainers.length).toBe(1);
        expect(hasLoopContainerActiveClass(loopContainers.at(0))).toBe(false);
        expect(hasLoopContainerActiveOutlineClass(loopContainers.at(0))).toBe(false);
    });
});

describe('Change loop iterations', () => {
    test('The ProgramSequence should be updated when the loop iterations are changed when the program is stopped', () => {
        const { wrapper, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
            runningState: 'stopped',
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 2},
                    {block: 'endLoop', label: 'A'}
                ],
                0,
                0,
                new Map([['A', 2]])
            )
        });

        const input = getProgramBlockLoopIterationsInput(wrapper, 0);
        ((input.getDOMNode(): any): HTMLInputElement).value = '4';
        input.simulate('change');
        input.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));

        expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
            new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 4
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                0,
                new Map([['A', 2]])
            )
        );
    });
    test('The ProgramSequence and loopIterationsLeft should be updated when the loop iterations are changed when the program is paused', () => {
        const { wrapper, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
            runningState: 'paused',
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 2},
                    {block: 'endLoop', label: 'A'}
                ],
                0,
                0,
                new Map([['A', 1]])
            )
        });

        const input = getProgramBlockLoopIterationsInput(wrapper, 0);
        ((input.getDOMNode(): any): HTMLInputElement).value = '4';
        input.simulate('change');
        input.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));

        expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
            new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 4
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                0,
                new Map([['A', 4]])
            )
        );
    });
});

describe('The expand add node toggle switch should be configurable via properties', () => {
    describe('Given that addNodeExpandedMode is false', () => {
        test('Then the toggle switch should be off, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createMountProgramBlockEditor({
                addNodeExpandedMode: false
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(false);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);

            toggleSwitch.simulate('click');
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls.length).toBe(1);
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls[0][0]).toBe(true);
        });
    });
    describe('Given that addNodeExpandedMode is true', () => {
        test('Then the toggle switch should be on, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createMountProgramBlockEditor({
                addNodeExpandedMode: true
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(true);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);

            toggleSwitch.simulate('click');
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls.length).toBe(1);
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls[0][0]).toBe(false);
        });
    });
});


describe("Add nodes", () => {
    test("All aria labels for add buttons should be correct when no action is selected.", () => {
        expect.assertions(3);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map()),
            addNodeExpandedMode: true
        });

        const leadingAddButton  = getAddNodeButtonAtPosition(wrapper, 0);
        const middleAddButton   = getAddNodeButtonAtPosition(wrapper, 1);
        const trailingAddButton = getAddNodeButtonAtPosition(wrapper, 2);

        [leadingAddButton, middleAddButton, trailingAddButton].forEach((button)=> {
            const ariaLabel = button.getDOMNode().getAttribute('aria-label');
            expect(ariaLabel).toBe("Make sure an action is selected");
        });
    });

    test("All aria labels for add buttons should be correct when an action is selected.", () => {
        expect.assertions(3);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map()),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        const leadingAddButton  = getAddNodeButtonAtPosition(wrapper, 0);
        const middleAddButton   = getAddNodeButtonAtPosition(wrapper, 1);
        const trailingAddButton = getAddNodeButtonAtPosition(wrapper, 2);

        // Add to the begining when an action is selected
        const addAtBeginningLabel = leadingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtBeginningLabel).toBe("Add selected action turn left 45 degrees to the beginning of the program");

        // Add in the middle when an action is selected
        const addAtMiddleLabel = middleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtMiddleLabel).toBe("Add selected action turn left 45 degrees between position 1, forward 1 square and position 2, turn right 45 degrees");

        // Add to the end when an action is selected
        const addAtEndLabel = trailingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtEndLabel).toBe("Add selected action turn left 45 degrees to the end of the program");
    });

    test("The aria label for the add button should be correct when there are no program blocks and an action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([], 0, 0, new Map()),
            selectedAction: 'left45'
        });

        const soleAddButton  = getAddNodeButtonAtPosition(wrapper, 0);

        // Add to the empty program when an action is selected
        const addButtonLabel = soleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addButtonLabel).toBe("Add selected action turn left 45 degrees to the beginning of the program");
    });


    test("The aria label for the add button should be correct when there are no program blocks and no action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([], 0, 0, new Map())
        });

        const soleAddButton  = getAddNodeButtonAtPosition(wrapper, 0);

        // Add to the end when an action is selected
        const addButtonLabel = soleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addButtonLabel).toBe("Make sure an action is selected");
    });
});

describe('Delete All button', () => {
    test('When the Delete All button is clicked, then the dialog shoud be shown', () => {
        expect.assertions(4);

        const { wrapper, audioManagerMock } = createMountProgramBlockEditor();

        // Initially, check that the modal is not showing
        expect(confirmDeleteAllModalIsOpen(wrapper)).toBe(false);
        // When the Delete All button is clicked
        const deleteAllButton = getProgramDeleteAllButton(wrapper).at(0);
        deleteAllButton.simulate('click');
        // Then the 'deleteAll' announcement should be played
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('deleteAll');
        // And the dialog should be shown
        expect(confirmDeleteAllModalIsOpen(wrapper)).toBe(true);
    });
});

describe("Add program steps", () => {
    test('When the add node at the end of the program is clicked, then the onInsertSelectedActionIntoProgram callback should be called', () => {
        expect.assertions(3);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, mockInsertSelectedActionIntoProgramHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}], 0, 0, new Map()),
            selectedAction: 'left45'
        });

        // When the add node at the end of the program is clicked
        // (The index is zero because the add nodes aren't expanded).
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the onInsertSelectedActionIntoProgram callback should
        // be called with index 5 and selectedAaction 'left45'
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls.length).toBe(1);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][0]).toBe(5);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][1]).toBe('left45');
    });

    test('When the add node at the beginning of the program is clicked, then the onInsertSelectedActionIntoProgram callback should be called', () => {
        expect.assertions(3);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, mockInsertSelectedActionIntoProgramHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}], 0, 0, new Map()),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        // When the add node at the beginning of the program is clicked
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the onInsertSelectedActionIntoProgram callback should
        // be called with index 0 and selectedAaction 'left45'
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls.length).toBe(1);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][0]).toBe(0);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][1]).toBe('left45');
    });

    test('When an add node within the program is clicked, then the onInsertSelectedActionIntoProgram callback should be called', () => {
        expect.assertions(3);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, mockInsertSelectedActionIntoProgramHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}], 0, 0, new Map()),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        // When the add node at position 3 is clicked
        const addNode = getAddNodeButtonAtPosition(wrapper, 3);
        addNode.simulate('click');

        // Then the onInsertSelectedActionIntoProgram callback should
        // be called with index 3 and selectedAaction 'left45'
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls.length).toBe(1);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][0]).toBe(3);
        expect(mockInsertSelectedActionIntoProgramHandler.mock.calls[0][1]).toBe('left45');
    });
});

describe('Delete program steps', () => {
    test.each([
        [ 0 ],
        [ 3 ]
    ])('When the delete step button is clicked for step %i, then the onDeleteProgramStep callback should be called',
        (stepNum) => {
            expect.assertions(2);
            const { wrapper, mockDeleteProgramStepHandler }
            = createMountProgramBlockEditor({
                actionPanelStepIndex: stepNum
            });

            const deleteStepButton = getActionPanelActionButtons(wrapper).at(0);
            deleteStepButton.simulate('click');

            // Then the onDeleteProgramStep callback should be called
            expect(mockDeleteProgramStepHandler.mock.calls.length).toBe(1);
            expect(mockDeleteProgramStepHandler.mock.calls[0][0]).toBe(stepNum);
        }
    );
});

describe('Replace program steps', () => {
    test.each([
        [ 0 ],
        [ 3 ]
    ]) ('When the replace step button is clicked for step %i, then the onReplaceProgramStep callback should be called',
        (stepNum) => {
            expect.assertions(3);
            const { wrapper, mockReplaceProgramStepHandler }
            = createMountProgramBlockEditor({
                actionPanelStepIndex: stepNum,
                selectedAction: 'right45'
            });

            const replaceButton = getActionPanelActionButtons(wrapper).at(1);
            replaceButton.simulate('click');

            // Then the onReplaceProgramStep callback should be called
            expect(mockReplaceProgramStepHandler.mock.calls.length).toBe(1);
            expect(mockReplaceProgramStepHandler.mock.calls[0][0]).toBe(stepNum);
            expect(mockReplaceProgramStepHandler.mock.calls[0][1]).toBe('right45');
        }
    );
});

describe('Move to previous program step', () => {
    test.each([
        [ 1, 'left45' ],
        [ 2, 'forward1' ]
    ])('When the move to previous button is clicked for step %i, then the onMoveProgramStepPrevious callback should be called',
        (stepNum, expectedCommandToMove) => {
            const { wrapper, mockMoveProgramStepPreviousHandler }
            = createMountProgramBlockEditor({
                actionPanelStepIndex: stepNum
            });

            const moveToPreviousButton = getActionPanelActionButtons(wrapper).at(2);
            moveToPreviousButton.simulate('click');

            // The onMoveProgramStep callback should be called
            expect(mockMoveProgramStepPreviousHandler.mock.calls.length).toBe(1);
            expect(mockMoveProgramStepPreviousHandler.mock.calls[0][0]).toBe(stepNum);
            expect(mockMoveProgramStepPreviousHandler.mock.calls[0][1]).toBe(expectedCommandToMove);
        }
    )
});

describe('Move to next program step', () => {
    test.each([
        [ 1, 'left45' ],
        [ 2, 'forward1' ]
    ])('When the move to next button is clicked for step %i, then the onMoveProgramStepNext callback should be called',
        (stepNum, expectedCommandToMove) => {
            const { wrapper, mockMoveProgramStepNextHandler }
            = createMountProgramBlockEditor({
                actionPanelStepIndex: stepNum
            });

            const moveToNextButton = getActionPanelActionButtons(wrapper).at(3);
            moveToNextButton.simulate('click');

            // The onMoveProgramStep callback should be called
            expect(mockMoveProgramStepNextHandler.mock.calls.length).toBe(1);
            expect(mockMoveProgramStepNextHandler.mock.calls[0][0]).toBe(stepNum);
            expect(mockMoveProgramStepNextHandler.mock.calls[0][1]).toBe(expectedCommandToMove);
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

describe('Autoscroll to show the active program step', () => {
    test('When active program step number is 0, scroll to the beginning of the container', () => {
        expect.assertions(2);
        const mockScrollTo = jest.fn();
        const { wrapper } = createMountProgramBlockEditor({runningState: 'running'});
        getProgramSequenceContainer(wrapper).ref.current.scrollTo = mockScrollTo;

        wrapper.setProps({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'left45'},
                    {block: 'forward1'},
                    {block: 'left45'}
                ],
                0,
                0,
                new Map()
            )
        });

        expect(mockScrollTo.mock.calls.length).toBe(1);
        expect(mockScrollTo.mock.calls[0][0]).toStrictEqual({
            left: 0,
            behavior: 'smooth'
        });
    });
    test('When the active program block is outside of the container, on the right', () => {
        expect.assertions(1);

        const mockScrollTo = jest.fn();

        const scrollRightPaddingPx = 128;

        const { wrapper } = createMountProgramBlockEditor({
            runningState: 'running',
            scrollRightPaddingPx
        });

        // Set the container ref object to a custom object with just enough
        // of the DOM API implemented to support the scroll logic
        const programSequenceContainer = getProgramSequenceContainer(wrapper);
        programSequenceContainer.ref.current = {
            getBoundingClientRect: () => {
                return {
                    left : 100
                };
            },
            clientWidth: 1000,
            scrollLeft: 200,
            scrollTo: mockScrollTo
        };

        // Set the location of the active block
        const activeProgramStep = getProgramBlockAtPosition(wrapper, 2);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        activeProgramStep.getDOMNode().getBoundingClientRect = () => {
            return {
                left: 2000,
                right: 2300
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'left45'},
                    {block: 'forward1'},
                    {block: 'left45'}
                ],
                2,
                0,
                new Map()
            )
        });

        expect(mockScrollTo.mock.calls[0][0]).toStrictEqual({
            left: 200 + 2300 + scrollRightPaddingPx - 100 - 1000,
            behavior: 'smooth'
        });
    });
    test('When the active program block is outside of the container, on the left', () => {
        expect.assertions(1);

        const mockScrollTo = jest.fn();

        const scrollLeftPaddingPx = 128;

        const { wrapper } = createMountProgramBlockEditor({
            runningState: 'running',
            scrollLeftPaddingPx
        });

        // Set the container ref object to a custom object with just enough
        // of the DOM API implemented to support the scroll logic
        const programSequenceContainer = getProgramSequenceContainer(wrapper);
        programSequenceContainer.ref.current = {
            getBoundingClientRect: () => {
                return {
                    left : 100
                };
            },
            clientWidth: 1000,
            scrollLeft: 2000,
            scrollTo: mockScrollTo
        };

        // Set the location of the active block
        const activeProgramStep = getProgramBlockAtPosition(wrapper, 2);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        activeProgramStep.getDOMNode().getBoundingClientRect = () => {
            return {
                left: -200,
                right: -100
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'left45'},
                    {block: 'forward1'},
                    {block: 'left45'}
                ],
                2,
                0,
                new Map()
            )
        });

        expect(mockScrollTo.mock.calls[0][0]).toStrictEqual({
            left: 2000 - 200 - scrollLeftPaddingPx - 100,
            behavior: 'smooth'
        });
    });
    test('When runningState changes to running, use instant scrolling', () => {
        expect.assertions(2);

        const mockScrollTo = jest.fn();

        const { wrapper } = createMountProgramBlockEditor({
            runningState: 'stopped',
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'left45'},
                    {block: 'forward1'},
                    {block: 'left45'}
                ],
                0,
                0,
                new Map()
            )
        });

        getProgramSequenceContainer(wrapper).ref.current.scrollTo = mockScrollTo;

        wrapper.setProps({
            runningState: 'running'
        });

        expect(mockScrollTo.mock.calls.length).toBe(1);
        expect(mockScrollTo.mock.calls[0][0]).toStrictEqual({
            left: 0,
            behavior: 'instant'
        });
    });
});

test('focusCommandBlockAfterUpdate', () => {
    expect.assertions(3);

    const mockFocus = jest.fn();

    window.HTMLElement.prototype.focus = mockFocus;

    const { wrapper, programBlockEditorRef } = createMountProgramBlockEditor({
        programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
    });

    // When focusCommandBlockAfterUpdate is called
    // $FlowFixMe: Ignore that 'current' might be null -- if it is, we want the test to fail
    programBlockEditorRef.current.focusCommandBlockAfterUpdate(1);

    // And the program is updated
    wrapper.setProps({ programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward3'}, {block: 'forward2'}], 0, 0, new Map()) });

    // Then the program step is focused
    expect(mockFocus.mock.calls.length).toBe(1);
    expect(mockFocus.mock.instances.length).toBe(1);
    expect(mockFocus.mock.instances[0]).toBe(getProgramBlockAtPosition(wrapper, 1).getDOMNode());
});

test('focusAddNodeAfterUpdate', () => {
    expect.assertions(3);

    const mockFocus = jest.fn();

    window.HTMLElement.prototype.focus = mockFocus;

    const { wrapper, programBlockEditorRef } = createMountProgramBlockEditor({
        programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map()),
        addNodeExpandedMode: true
    });

    // When focusAddNodeAfterUpdate is called
    // $FlowFixMe: Ignore that 'current' might be null -- if it is, we want the test to fail
    programBlockEditorRef.current.focusAddNodeAfterUpdate(1);

    // And the program is updated
    wrapper.setProps({ programSequence: new ProgramSequence([{block: 'forward1'}], 0, 0, new Map()) });

    // Then the add-node is focused
    expect(mockFocus.mock.calls.length).toBe(1);
    expect(mockFocus.mock.instances.length).toBe(1);
    expect(mockFocus.mock.instances[0]).toBe(getAddNodeButtonAtPosition(wrapper, 1).getDOMNode());
});

test('scrollToAddNodeAfterUpdate', () => {
    expect.assertions(4);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'left45' as the selected command
    const { wrapper, programBlockEditorRef } = createMountProgramBlockEditor({
        programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}], 0, 0, new Map()),
        selectedAction: 'left45'
    });

    // When scrollToAddNodeAfterUpdate is called
    // $FlowFixMe: Ignore that 'current' might be null -- if it is, we want the test to fail
    programBlockEditorRef.current.scrollToAddNodeAfterUpdate(6);

    // And the program is updated
    wrapper.setProps({ programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'forward1'}, {block: 'left45'}], 0, 0, new Map()) });

    // Then the ProgramBlockEditor is scrolled
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
    expect(mockScrollIntoView.mock.instances.length).toBe(1);

    // (The index used to get the add node button position is zero because the add nodes aren't expanded).
    expect(mockScrollIntoView.mock.instances[0]).toBe(getAddNodeButtonAtPosition(wrapper, 0).getDOMNode());
});

describe('When runningState property is paused and programCounter is 0', () => {
    test('className of step 0 should have --paused', () => {
        expect.assertions(1);
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'paused' });
        const currentStep = getProgramBlockAtPosition(wrapper, 0);

        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--paused')).toBe(true);
    });
});

describe('When runningState property is pauseRequested and programCounter is 0', () => {
    test('className of step 1 should have --paused', () => {
        expect.assertions(1);
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'pauseRequested' });
        const pausedStep = getProgramBlockAtPosition(wrapper, 1);

        expect(pausedStep.get(0).props.className.includes('ProgramBlockEditor__program-block--paused')).toBe(true);
    });
});

describe('When runningState is running, stopRequested, or pauseRequested, and programCounter is 0', () => {
    test('className of step 0 should have --active', () => {
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'running' });
        let currentStep = getProgramBlockAtPosition(wrapper, 0);

        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);
        wrapper.setProps({ runningState: 'stopRequested' });
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);

        wrapper.setProps({ runningState: 'pauseRequested' });
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);

        wrapper.setProps({ runningState: 'paused'});
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(false);

        wrapper.setProps({ runningState: 'stopped'});
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(false);
    });
});
