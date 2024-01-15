// @flow

import CustomBackgroundDesignModeButton from './CustomBackgroundDesignModeButton';
import type { CustomBackgroundDesignModeButtonProps } from './CustomBackgroundDesignModeButton';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { createIntl } from 'react-intl';
import messages from './messages.json';

configure({ adapter: new Adapter()});

function createComponent(customBackgroundDesignMode: boolean, disabled: boolean) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const changeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            CustomBackgroundDesignModeButton.WrappedComponent,
            ({
                customBackgroundDesignMode: customBackgroundDesignMode,
                disabled: disabled,
                intl: intl,
                onChange: changeHandler
            }: CustomBackgroundDesignModeButtonProps)
        )
    );

    return { wrapper, changeHandler };
}

describe('The image changes with customBackgroundDesignMode', () => {
    test('customBackgroundDesignMode: true', () => {
        const { wrapper } = createComponent(true, false);
        expect(wrapper.get(0).props.children.type.render().props.children).toBe('ExitDesignMode.svg');
    });

    test('customBackgroundDesignMode: false', () => {
        const { wrapper } = createComponent(false, false);
        expect(wrapper.get(0).props.children.type.render().props.children).toBe('EnterDesignMode.svg');
    });
});

describe('aria-pressed is set to customBackgroundDesignMode', () => {
    test('customBackgroundDesignMode: true', () => {
        const { wrapper } = createComponent(true, false);
        expect(wrapper.prop('ariaPressed')).toBe(true);
    });

    test('customBackgroundDesignMode: false', () => {
        const { wrapper } = createComponent(false, false);
        expect(wrapper.prop('ariaPressed')).toBe(false);
    });
});

describe('The change handler is called with the inverse of customBackgroundDesignMode', () => {
    test('customBackgroundDesignMode: true', () => {
        const { wrapper, changeHandler } = createComponent(true, false);
        wrapper.simulate('click');
        expect(changeHandler.mock.calls.length).toBe(1);
        expect(changeHandler.mock.calls[0][0]).toBe(false);
    });

    test('customBackgroundDesignMode: false', () => {
        const { wrapper, changeHandler } = createComponent(false, false);
        wrapper.simulate('click');
        expect(changeHandler.mock.calls.length).toBe(1);
        expect(changeHandler.mock.calls[0][0]).toBe(true);
    });
});

describe('The disabled property is set on the IconButton', () => {
    test('disabled: false', () => {
        const { wrapper, changeHandler } = createComponent(false, false);
        expect(wrapper.prop('disabled')).toBe(false);
    });

    test('disabled: true', () => {
        const { wrapper, changeHandler } = createComponent(false, true);
        expect(wrapper.prop('disabled')).toBe(true);
    });
});
