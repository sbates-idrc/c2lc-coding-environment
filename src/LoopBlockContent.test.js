// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import LoopBlockContent from './LoopBlockContent';

configure({ adapter: new Adapter() });

const defaultLoopBlockContentProps = {
    commandName: 'startLoop',
    disabled: false,
    loopIterations: '2',
    loopLabel: 'A',
    stepNumber: 2
};

function createMountLoopBlockContent(props) {
    const mockOnChangeLoopIterations = jest.fn();
    const wrapper = mount(
        React.createElement(
            LoopBlockContent,
            Object.assign(
                {},
                defaultLoopBlockContentProps,
                { onChangeLoopIterations: mockOnChangeLoopIterations },
                props
            )
        )
    );
    return { wrapper, mockOnChangeLoopIterations };
}

function getLoopLabelContainer(wrapper) {
    return wrapper.find('.LoopBlockContent-loopLabelContainer');
}

function getLoopIterations(wrapper) {
    return wrapper.find('.LoopBlockContent__loopIterations');
}

describe('Rendering LoopBlockContent', () => {
    test('startLoop content', () => {
        expect.assertions(8);
        const {wrapper, mockOnChangeLoopIterations} = createMountLoopBlockContent();
        const loopBlockLabel = getLoopLabelContainer(wrapper);
        expect(loopBlockLabel.get(0).props.children).toBe('A');
        const loopBlockCounter = getLoopIterations(wrapper);
        expect(loopBlockCounter.get(0).props.value).toBe('2');

        const firstLoopIterationsValue = '4';
        const secondLoopIterationsValue = '3';

        ((loopBlockCounter.getDOMNode(): any): HTMLInputElement).value = firstLoopIterationsValue;

        loopBlockCounter.simulate('change');
        expect(wrapper.instance().state.loopIterations).toBe(firstLoopIterationsValue);

        loopBlockCounter.simulate('blur');
        expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
        expect(mockOnChangeLoopIterations.mock.calls[0][0]).toBe(firstLoopIterationsValue);

        ((loopBlockCounter.getDOMNode(): any): HTMLInputElement).value = secondLoopIterationsValue;

        loopBlockCounter.simulate('change');
        expect(wrapper.instance().state.loopIterations).toBe(secondLoopIterationsValue);

        loopBlockCounter.simulate('keyDown', {key: 'Enter'});
        expect(mockOnChangeLoopIterations.mock.calls.length).toBe(2);
        expect(mockOnChangeLoopIterations.mock.calls[1][0]).toBe(secondLoopIterationsValue);
    });
});
