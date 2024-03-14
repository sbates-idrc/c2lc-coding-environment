// @flow

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { makeKeyDownEvent } from './TestUtils';
import type { TileCode } from './TileData';
import TilePanel from './TilePanel';
import type { ThemeName } from './types';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const selectedTileClass = 'TilePanel__tile--selected';

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

test('When no tile is selected, no tile has the TilePanel__tile--selected class and all tiles has aria-checked=false', () => {
    expect.assertions(35);
    const { wrapper } = createComponent(null, 'default');
    const tiles = wrapper.find('button');
    expect(tiles).toHaveLength(17);
    tiles.forEach((tile) => {
        expect(tile.hasClass(selectedTileClass)).toBe(false);
        expect(tile.getDOMNode().getAttribute('aria-checked')).toBe('false');
    });
});

test('When no tile is selected, the first tile has tabIndex=0 and all others have tabIndex=-1', () => {
    expect.assertions(18);
    const { wrapper } = createComponent(null, 'default');
    const tiles = wrapper.find('button');
    expect(tiles).toHaveLength(17);
    tiles.forEach((tile, i) => {
        if (i === 0) {
            expect(tile.getDOMNode().getAttribute('tabIndex')).toBe('0');
        } else {
            expect(tile.getDOMNode().getAttribute('tabIndex')).toBe('-1');
        }
    });
});

test('When a tile is selected, only that tile has the TilePanel__tile--selected class, aria-checked=true, and tabIndex=0; all other tiles have aria-checked=false and tabIndex=-1', () => {
    expect.assertions(52);

    const selectedTileCode = '2';
    // The tile with code '2' is at index 5 in the tile panel
    const expectedSelectedTileIndex = 5;

    const { wrapper } = createComponent(selectedTileCode, 'default');
    const tiles = wrapper.find('button');
    expect(tiles).toHaveLength(17);
    tiles.forEach((tile, i) => {
        if (i === expectedSelectedTileIndex) {
            expect(tile.hasClass(selectedTileClass)).toBe(true);
            expect(tile.getDOMNode().getAttribute('aria-checked')).toBe('true');
            expect(tile.getDOMNode().getAttribute('tabIndex')).toBe('0');
        } else {
            expect(tile.hasClass(selectedTileClass)).toBe(false);
            expect(tile.getDOMNode().getAttribute('aria-checked')).toBe('false');
            expect(tile.getDOMNode().getAttribute('tabIndex')).toBe('-1');
        }
    });
});

test.each([
    ['ArrowRight', '0', '1'],
    ['ArrowRight', 'D', '0'],
    ['ArrowDown', '0', '1'],
    ['ArrowDown', 'D', '0'],
    ['ArrowLeft', '0', 'D'],
    ['ArrowLeft', '1', '0'],
    ['ArrowUp', '0', 'D'],
    ['ArrowUp', '1', '0']
])('%s on TileCode %s, expect TileCode %s', (key, startTileCode, expectedTileCode) => {
    const { wrapper, selectTileHandler } = createComponent(null, 'default');
    const tile = wrapper.find(`button[data-tilecode="${startTileCode}"]`);
    tile.simulate('keydown', makeKeyDownEvent(tile.getDOMNode(), key));
    expect(selectTileHandler.mock.calls.length).toBe(1);
    expect(selectTileHandler.mock.calls[0][0]).toBe(expectedTileCode);
});

test('Clicking on a tile calls the provided callback', () => {
    const { wrapper, selectTileHandler } = createComponent(null, 'default');
    wrapper.find('button[data-tilecode="2"]').simulate('click');
    expect(selectTileHandler.mock.calls.length).toBe(1);
    expect(selectTileHandler.mock.calls[0][0]).toBe('2');
});
