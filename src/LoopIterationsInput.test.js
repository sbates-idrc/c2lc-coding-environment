// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import LoopIterationsInput from './LoopIterationsInput';

configure({ adapter: new Adapter() });

const defaultLoopIterationsInputProps = {
    loopIterations: 4,
    loopIterationsLeft: 2,
    loopLabel: 'A',
    stepNumber: 2,
    runningState: 'stopped',
    keyboardInputSchemeName: 'controlalt'
};

function createMountLoopIterationsInput(props) {
    const mockOnChangeLoopIterations = jest.fn();
    const wrapper = mount(
        React.createElement(
            LoopIterationsInput,
            Object.assign(
                {},
                defaultLoopIterationsInputProps,
                { onChangeLoopIterations: mockOnChangeLoopIterations },
                props
            )
        )
    );
    return { wrapper, mockOnChangeLoopIterations };
}

function getLoopIterationsInput(wrapper) {
    return wrapper.find('.command-block-loop-iterations');
}

function getLoopIterationsInputValue(wrapper): string {
    return ((wrapper.find('.command-block-loop-iterations').getDOMNode(): any): HTMLInputElement).value;
}

function getLoopIterationsInputReadOnly(wrapper): boolean {
    return ((wrapper.find('.command-block-loop-iterations').getDOMNode(): any): HTMLInputElement).readOnly;
}

test('When stopped, the number of iterations should be rendered in an editable input', () => {
    expect.assertions(2);
    const {wrapper} = createMountLoopIterationsInput({
        runningState: 'stopped'
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');
    expect(getLoopIterationsInputReadOnly(wrapper)).toBe(false);
});

test('When paused, the number of iterations left should be rendered in an editable input', () => {
    expect.assertions(2);
    const {wrapper} = createMountLoopIterationsInput({
        runningState: 'paused'
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');
    expect(getLoopIterationsInputReadOnly(wrapper)).toBe(false);
});

test('When running, the number of iterations left should be rendered in a read-only input', () => {
    expect.assertions(2);
    const {wrapper} = createMountLoopIterationsInput({
        runningState: 'running'
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');
    expect(getLoopIterationsInputReadOnly(wrapper)).toBe(true);
});

test('Blur should call the registered callback if the user changed the value', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    // Change the value and check that the callback is called on blur

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('3');

    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test('Blur should not call the registered callback if the user has not changed the value', () => {
    expect.assertions(2);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test.each([
    ['stopped', '4'],
    ['paused', '2'],
])('Blur should reset the value if the user provided an invalid value', (runningState, expectedValue) => {
    expect.assertions(5);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput({
        runningState
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValue);

    // Change the value and check that the value is reset on blur

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = 'a';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('a');

    loopIterationsInput.simulate('blur');
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValue);
    expect(wrapper.instance().state.editStr).toBe(expectedValue);
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test('Pressing Enter should call the registered callback', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    // Change the value and check that the callback is called on press Enter

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test.each([
    ['stopped', '4'],
    ['paused', '2'],
])('Pressing Enter should reset the value if the user provided an invalid value', (runningState, expectedValue) => {
    expect.assertions(5);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput({
        runningState
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValue);

    // Change the value and check that the value is reset on Enter

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = 'a';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('a');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValue);
    expect(wrapper.instance().state.editStr).toBe(expectedValue);
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

const shortcutKeyboardEvents = [
    new KeyboardEvent('keydown', {key: 'a', ctrlKey: true, altKey: true}), // addCommand
    new KeyboardEvent('keydown', {key: 'b', ctrlKey: true, altKey: true}), // addCommandToBeginning
    new KeyboardEvent('keydown', {key: ']', ctrlKey: true, altKey: true}), // moveToNextStep
    new KeyboardEvent('keydown', {key: '[', ctrlKey: true, altKey: true}), // moveToPreviousStep
    new KeyboardEvent('keydown', {key: 'p', ctrlKey: true, altKey: true}), // playPauseProgram
    new KeyboardEvent('keydown', {key: 's', ctrlKey: true, altKey: true})  // stopProgram
];

test.each(shortcutKeyboardEvents)('Shortcuts that cause an update should call the registered callback if the user changed the value', (keyboardEvent) => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    // Change the value, send the keyboard event, and check that the callback is called

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(keyboardEvent);

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test.each(shortcutKeyboardEvents)('Shortcuts that cause an update should not call the registered callback if the user has not changed the value', (keyboardEvent) => {
    expect.assertions(2);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    loopIterationsInput.getDOMNode().dispatchEvent(keyboardEvent);
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test('Other shortcuts should not cause the registered callback to be called', () => {
    expect.assertions(3);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('4');

    // Change the value, send the keyboard event, and check that the callback is not called

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.editStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown',
        {key: 'x', ctrlKey: true, altKey: true}));

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test.each([
    ['running', '2', 'stopped', '4'],
    ['running', '2', 'paused', '2'],
    ['paused', '2', 'stopped', '4']
])('Changing to an edit state should initialize the input with the expected value',
(runningStateBefore, expectedValueBefore, runningStateAfter, expectedValueAfter) => {
    expect.assertions(3);
    const {wrapper} = createMountLoopIterationsInput({
        runningState: runningStateBefore
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValueBefore);

    // Change the runningState and check that the value is initialized

    wrapper.setProps({
        runningState: runningStateAfter
    });
    expect(getLoopIterationsInputValue(wrapper)).toBe(expectedValueAfter);
    expect(wrapper.instance().state.editStr).toBe(expectedValueAfter);
});
