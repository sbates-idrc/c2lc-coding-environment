// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ThemeSelector from './ThemeSelector';

configure({ adapter: new Adapter() });

const defaultThemeSelectorProps = {
    currentTheme: 'default',
    show: true
};

function createMountThemeSelector(props) {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();
    const wrapper = mount(
        React.createElement(
            ThemeSelector,
            Object.assign(
                {},
                defaultThemeSelectorProps,
                {
                    onSelect: mockOnSelect,
                    onChange: mockOnChange
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
        mockOnSelect,
        mockOnChange
    };
}

function getThemeSelectorOption(wrapper) {
    return wrapper.find('.ThemeSelector__option');
}

function getThemeSelectorRadioButton(wrapper) {
    return wrapper.find('.ThemeSelector__option-radio');
}

function getCancelButton(wrapper) {
    return wrapper.find('.ThemeSelector__button-cancel');
}

function getDoneButton(wrapper) {
    return wrapper.find('.ThemeSelector__button-done');
}

describe('When rendering selector options', () => {
    test('All themes should be displayed as options and only one is checked', () => {
        expect.assertions(10);
        const { wrapper } = createMountThemeSelector();
        const selectorOptions = getThemeSelectorOption(wrapper);

        // Default Theme
        expect(selectorOptions.get(0).props.className.includes('default')).toBe(true);
        expect(selectorOptions.get(0).props.children[0].props.checked).toBe(true);

        // Light Theme
        expect(selectorOptions.get(1).props.className.includes('light')).toBe(true);
        expect(selectorOptions.get(1).props.children[0].props.checked).toBe(false);

        // Dark Theme
        expect(selectorOptions.get(2).props.className.includes('dark')).toBe(true);
        expect(selectorOptions.get(2).props.children[0].props.checked).toBe(false);

        // Grayscale Theme
        expect(selectorOptions.get(3).props.className.includes('grayscale')).toBe(true);
        expect(selectorOptions.get(3).props.children[0].props.checked).toBe(false);

        // High Contrast Theme
        expect(selectorOptions.get(4).props.className.includes('contrast')).toBe(true);
        expect(selectorOptions.get(4).props.children[0].props.checked).toBe(false);
    });
});

describe('When selecting a theme', () => {
    test('should call onSelect prop', () => {
        expect.assertions(10);
        const { wrapper, mockOnSelect } = createMountThemeSelector();

        const themeSelectorOptions = getThemeSelectorRadioButton(wrapper);
        const defaultThemeSelector = themeSelectorOptions.at(0);
        const lightThemeSelector = themeSelectorOptions.at(1);
        const darkThemeSelector = themeSelectorOptions.at(2);
        const grayScaleThemeSelector = themeSelectorOptions.at(3);
        const highContrastThemeSelector = themeSelectorOptions.at(4);

        // Light Theme
        lightThemeSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(1);
        expect(mockOnSelect.mock.calls[0][0]).toBe('light');

        // Dark Theme
        darkThemeSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(2);
        expect(mockOnSelect.mock.calls[1][0]).toBe('dark');

        // Grayscale Theme
        grayScaleThemeSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(3);
        expect(mockOnSelect.mock.calls[2][0]).toBe('grayscale');

        // High Contrast Theme
        highContrastThemeSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(4);
        expect(mockOnSelect.mock.calls[3][0]).toBe('contrast');

        // Default
        defaultThemeSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(5);
        expect(mockOnSelect.mock.calls[4][0]).toBe('default');
    })
});

describe('When the cancel button is clicked', () => {
    test('The theme stays the same as when the modal is opened', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountThemeSelector({currentTheme: 'dark'});
        const cancelButton = getCancelButton(wrapper).at(0);
        wrapper.setProps({currentTheme: 'light'});
        cancelButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('dark');
    })
});

describe('When the done button is clicked', () => {
    test('The theme changed to the selected theme', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountThemeSelector({currentTheme: 'default'});
        const doneButton = getDoneButton(wrapper).at(0);
        wrapper.setProps({currentTheme: 'dark'});
        doneButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('dark');
    })
})
