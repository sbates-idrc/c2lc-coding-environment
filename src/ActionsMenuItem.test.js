// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ActionsMenuItem from './ActionsMenuItem';

import messages from './messages.json';

configure({ adapter: new Adapter()});

function createActionsMenuItem(props) {
    const mockChangeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ActionsMenuItem,
            Object.assign(
                {
                    isAllowed: true,
                    isUsed: false,
                    itemKey: 'forward1',
                    onChange: mockChangeHandler
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
        mockChangeHandler
    };
};

it('Renders without crashing.', () => {
    createActionsMenuItem();
});

it('Renders without crashing when it is flag as "used".', () => {
    createActionsMenuItem({ isUsed: true });
});

it('Renders without crashing when it is flag as "not allowed".', () => {
    createActionsMenuItem({ isAllowed: false });
});

it("Changes on click.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const input = wrapper.find(".ActionsMenuItem");
    input.simulate("click");

    expect(mockChangeHandler.mock.calls.length).toBe(1);
});

it("Changes on appropriate keydown.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const preventDefault = jest.fn();
    const input = wrapper.find(".ActionsMenuItem");
    input.simulate("keydown", { key: 'Enter', preventDefault: preventDefault});

    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(preventDefault.mock.calls.length).toBe(1);

    input.simulate("keydown", { key: ' ', preventDefault: preventDefault});
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(preventDefault.mock.calls.length).toBe(2);
});

it("Does not respond to irrelevant keydown.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const input = wrapper.find(".ActionsMenuItem");

    const preventDefault = jest.fn();
    input.simulate("keydown", { key: 'Tab', preventDefault: preventDefault});

    expect(mockChangeHandler.mock.calls.length).toBe(0);
    expect(preventDefault.mock.calls.length).toBe(0);
});