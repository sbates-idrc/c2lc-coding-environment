// @flow

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LanguageSelector from './LanguageSelector';
import React from 'react';
import type { LanguageCode } from './types';

configure({ adapter: new Adapter()});

function createComponent(language: LanguageCode) {
    const changeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            LanguageSelector,
            {
                value: language,
                onChange: changeHandler
            }
        )
    );

    return { wrapper, changeHandler };
}

test('When the language is English, the label should be "Français" and clicking the selector should call the handler with "fr"', () => {
    expect.assertions(5);

    const { wrapper, changeHandler } = createComponent('en');

    const button = wrapper.find('button');
    expect(button).toHaveLength(1);

    expect(button.text()).toBe('Français');
    expect(button.prop('lang')).toBe('fr');

    button.simulate('click');
    expect(changeHandler.mock.calls.length).toBe(1);
    expect(changeHandler.mock.calls[0][0]).toBe('fr');
});

test('When the language is French, the label should be "English" and clicking the selector should call the handler with "en"', () => {
    expect.assertions(5);

    const { wrapper, changeHandler } = createComponent('fr');

    const button = wrapper.find('button');
    expect(button).toHaveLength(1);

    expect(button.text()).toBe('English');
    expect(button.prop('lang')).toBe('en');

    button.simulate('click');
    expect(changeHandler.mock.calls.length).toBe(1);
    expect(changeHandler.mock.calls[0][0]).toBe('en');
});
