// @flow

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { IntlProvider } from 'react-intl';
import type { TileCode } from './TileData';
import TilePanel from './TilePanel';
import type { ThemeName } from './types';
import messages from './messages.json';

configure({ adapter: new Adapter()});

function createComponent(selectedTile: ?TileCode, theme: ThemeName) {
    const selectTileHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            TilePanel,
            {
                selectedTile: selectedTile,
                theme: theme,
                onSelectTile: selectTileHandler
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

    return { wrapper, selectTileHandler };
}

test('All expected tiles are rendered', () => {
    const { wrapper } = createComponent(null, 'default');
    expect(wrapper.find('button')).toHaveLength(17);
});

describe('If there is a selceted tile, it has the TilePanel__tile--selected class', () => {
    const selectedTileClassSelector = '.TilePanel__tile--selected';
    test('No selected tile', () => {
        const { wrapper } = createComponent(null, 'default');
        expect(wrapper.find(selectedTileClassSelector)).toHaveLength(0);
    });
    test('Selected tile', () => {
        const { wrapper } = createComponent('0', 'default');
        expect(wrapper.find(selectedTileClassSelector)).toHaveLength(1);
    });
});

test('Clicking on a tile calls the provided callback', () => {
    const { wrapper, selectTileHandler } = createComponent(null, 'default');
    wrapper.find('button[data-tilecode="2"]').simulate('click');
    expect(selectTileHandler.mock.calls.length).toBe(1);
    expect(selectTileHandler.mock.calls[0][0]).toBe('2');
});

test('Mouse down on a tile calls the provided callback', () => {
    const { wrapper, selectTileHandler } = createComponent(null, 'default');
    wrapper.find('button[data-tilecode="2"]').simulate('mousedown');
    expect(selectTileHandler.mock.calls.length).toBe(1);
    expect(selectTileHandler.mock.calls[0][0]).toBe('2');
});
