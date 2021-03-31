// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ThemeSelector from './ThemeSelector';
import type { ThemeName } from './types';

configure({ adapter: new Adapter() });

function createMountThemeSelector(props) {
    const wrapper = mount(
        React.createElement(
            ThemeSelector,
            {
                onSelect: (value: ThemeName) => {}
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
        const selectorOptions = getThemeSelector(wrapper).get(0).props.children;
        expect(selectorOptions[0].props.eventKey).toBe('mixed');
        expect(selectorOptions[1].props.eventKey).toBe('light');
        expect(selectorOptions[2].props.eventKey).toBe('dark');
        expect(selectorOptions[3].props.eventKey).toBe('gray');
        expect(selectorOptions[4].props.eventKey).toBe('contrast');
    });
})

