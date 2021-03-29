// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import AddNode from './AddNode';

configure({ adapter: new Adapter()});

const expandedButtonSelector = '.AddNode__expanded-button';
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
                    closestAddNodeIndex: -1,
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
    expect(wrapper.exists(expandedButtonSelector)).toBe(false);
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
        expect(wrapper.exists(expandedButtonSelector)).toBe(true);
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
        expect(wrapper.exists(expandedButtonSelector)).toBe(true);
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
