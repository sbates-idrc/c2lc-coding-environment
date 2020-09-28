// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import AddNode from './AddNode';

configure({ adapter: new Adapter()});

const expandedDropAreaSelector = '.AddNode__expanded-drop-area';
const expandedButtonSelector = '.AddNode__expanded-button';
const collapsedDropAreaSelector = '.AddNode__collapsed-drop-area';
const collapsedIconSelector = '.AddNode__collapsed-icon';

function mountAddNode(props) {
    const mockClickHandler = jest.fn();
    const mockDropHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            AddNode,
            Object.assign(
                {
                    expandedMode: false,
                    programStepNumber: 0,
                    disabled: false,
                    'aria-label': 'some aria label',
                    isDraggingCommand: false,
                    onClick: mockClickHandler,
                    onDrop: mockDropHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockClickHandler,
        mockDropHandler
    };
}

function getExpandedButtonElem(wrapper) {
    return wrapper.find(expandedButtonSelector).hostNodes().getDOMNode();
}

test('Given expandedMode is false, it should be in collapsed state', () => {
    const { wrapper } = mountAddNode({
        expandedMode: false
    });
    expect(wrapper.exists(expandedDropAreaSelector)).toBe(false);
    expect(wrapper.exists(expandedButtonSelector)).toBe(false);
    expect(wrapper.exists(collapsedDropAreaSelector)).toBe(true);
    expect(wrapper.exists(collapsedIconSelector)).toBe(true);
});

describe('Given expandedMode is true and disabled is false', () => {
    let wrapper, mockClickHandler, mockDropHandler;
    const expectedProgramStepNumber = 3;

    beforeEach(() => {
        ({ wrapper, mockClickHandler, mockDropHandler } = mountAddNode({
            expandedMode: true,
            programStepNumber: expectedProgramStepNumber,
            disabled: false
        }));
    });

    test('It should be in expanded state', () => {
        expect(wrapper.exists(expandedDropAreaSelector)).toBe(true);
        expect(wrapper.exists(expandedButtonSelector)).toBe(true);
        expect(wrapper.exists(collapsedDropAreaSelector)).toBe(false);
        expect(wrapper.exists(collapsedIconSelector)).toBe(false);
    });

    test('The button should have the specified aria-label', () => {
        const buttonElem = getExpandedButtonElem(wrapper);
        expect(buttonElem.getAttribute('aria-label')).toBe('some aria label');
    });

    test('The button should be enabled', () => {
        const buttonElem = getExpandedButtonElem(wrapper);
        expect(buttonElem.getAttribute('aria-disabled')).toBe('false');
    });

    test('When the button is clicked, then the onClick handler should be called', () => {
        wrapper.find(expandedButtonSelector).hostNodes().simulate('click');
        expect(mockClickHandler.mock.calls.length).toBe(1);
        expect(mockClickHandler.mock.calls[0][0]).toBe(expectedProgramStepNumber);
        expect(mockDropHandler.mock.calls.length).toBe(0);
    });

    test('When there is a drop, then the onDrop handler should be called', () => {
        wrapper.find(expandedDropAreaSelector).hostNodes().simulate('drop');
        expect(mockDropHandler.mock.calls.length).toBe(1);
        expect(mockDropHandler.mock.calls[0][0]).toBe(expectedProgramStepNumber);
        expect(mockClickHandler.mock.calls.length).toBe(0);
    });
});

describe('Given expandedMode is true and disabled is true', () => {
    let wrapper;

    beforeEach(() => {
        ({ wrapper } = mountAddNode({
            expandedMode: true,
            disabled: true
        }));
    });

    test('It should be in expanded state', () => {
        expect(wrapper.exists(expandedDropAreaSelector)).toBe(true);
        expect(wrapper.exists(expandedButtonSelector)).toBe(true);
        expect(wrapper.exists(collapsedDropAreaSelector)).toBe(false);
        expect(wrapper.exists(collapsedIconSelector)).toBe(false);
    });

    test('The button should have the specified aria-label', () => {
        const buttonElem = getExpandedButtonElem(wrapper);
        expect(buttonElem.getAttribute('aria-label')).toBe('some aria label');
    });

    test('The button should be disabled', () => {
        const buttonElem = getExpandedButtonElem(wrapper);
        expect(buttonElem.getAttribute('aria-disabled')).toBe('true');
    });
});
