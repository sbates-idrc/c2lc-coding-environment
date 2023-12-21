// @flow

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { IntlProvider } from 'react-intl';
import SceneMessage from './SceneMessage';
import messages from './messages.json';

configure({ adapter: new Adapter()});

function createComponent(message: string) {
    const closeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            SceneMessage,
            {
                message: message,
                onClose: closeHandler
            }
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

    return { wrapper, closeHandler };
}

test('The provided message is displayed', () => {
    const { wrapper } = createComponent('hello, world');
    expect(wrapper.find('.SceneMessage__text').text()).toBe('hello, world');
});

test('Clicking on the close button calls the provided callback', () => {
    const { wrapper, closeHandler } = createComponent('hello, world');
    wrapper.find('.SceneMessage__closeButton').simulate('click');
    expect(closeHandler.mock.calls.length).toBe(1);
});
