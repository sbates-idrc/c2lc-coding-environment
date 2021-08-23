// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ThemeSelector from './ThemeSelector';

configure({ adapter: new Adapter() });

function createMountThemeSelector() {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();
    const wrapper = mount(
        React.createElement(
            ThemeSelector,
            {
                currentTheme: 'default',
                show: true,
                onSelect: mockOnSelect,
                onChange: mockOnChange
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

    return wrapper;
}

function getThemeSelector(wrapper) {
    return wrapper.find('.ThemeSelector');
}

describe('When rendering selector options', () => {
    test('All themes should be displayed as options', () => {
        expect.assertions(5);
        const wrapper = createMountThemeSelector();
        // const selectorOptions = getThemeSelector(wrapper).get(0).props.children;
    });
})

