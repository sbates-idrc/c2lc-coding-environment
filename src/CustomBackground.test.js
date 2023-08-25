// @flow

import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';

test('When tiles are not provided to the constructor, default to 0', () => {
    const customBackground  = new CustomBackground(new SceneDimensions(1, 3, 1, 2));
    expect(customBackground.tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
});

test('When the expected number of tiles are provided to the constructor, use them', () => {
    const customBackground  = new CustomBackground(
        new SceneDimensions(1, 3, 1, 2),
        ['0', '1', '2', '3', '4', '5']
    );
    expect(customBackground.tiles).toStrictEqual(['0', '1', '2', '3', '4', '5']);
});

test('When too few tiles are provided to the constructor, fill the remaining with 0', () => {
    const customBackground  = new CustomBackground(
        new SceneDimensions(1, 3, 1, 2),
        ['1', '2', '3', '4', '5']
    );
    expect(customBackground.tiles).toStrictEqual(['1', '2', '3', '4', '5', '0']);
});

test('When too many tiles are provided to the constructor, use just the needed amount of tiles from the start of the provided array', () => {
    const customBackground  = new CustomBackground(
        new SceneDimensions(1, 3, 1, 2),
        ['1', '2', '3', '4', '5', '6', '7']
    );
    expect(customBackground.tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
});

test('Get tiles', () => {
    const customBackground  = new CustomBackground(
        new SceneDimensions(1, 3, 1, 2),
        ['0', '1', '2', '3', '4', '5']
    );
    expect(customBackground.getTile(1, 1)).toBe('0');
    expect(customBackground.getTile(2, 1)).toBe('1');
    expect(customBackground.getTile(3, 1)).toBe('2');
    expect(customBackground.getTile(1, 2)).toBe('3');
    expect(customBackground.getTile(2, 2)).toBe('4');
    expect(customBackground.getTile(3, 2)).toBe('5');
});

test('Set tiles', () => {
    const originalCustomBackground  = new CustomBackground(new SceneDimensions(1, 3, 1, 2));
    const updatedCustomBackground = originalCustomBackground
        .setTile(1, 1, '1')
        .setTile(2, 1, '2')
        .setTile(3, 1, '3')
        .setTile(1, 2, '4')
        .setTile(2, 2, '5')
        .setTile(3, 2, '6');
    expect(originalCustomBackground.tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(updatedCustomBackground.tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
});
