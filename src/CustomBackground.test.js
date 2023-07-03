// @flow

import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';

test('All tiles are set to the value provided at construction', () => {
    const customBackground  = new CustomBackground(new SceneDimensions(1, 3, 1, 2), '0');

    expect(customBackground.tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);

    expect(customBackground.getTile(1, 1)).toBe('0');
    expect(customBackground.getTile(2, 1)).toBe('0');
    expect(customBackground.getTile(3, 1)).toBe('0');
    expect(customBackground.getTile(1, 2)).toBe('0');
    expect(customBackground.getTile(2, 2)).toBe('0');
    expect(customBackground.getTile(3, 2)).toBe('0');
});

test('Set and get tiles', () => {
    const customBackground  = new CustomBackground(new SceneDimensions(1, 3, 1, 2), '0');

    customBackground.setTile(1, 1, '0');
    customBackground.setTile(2, 1, '1');
    customBackground.setTile(3, 1, '2');
    customBackground.setTile(1, 2, '3');
    customBackground.setTile(2, 2, '4');
    customBackground.setTile(3, 2, '5');

    expect(customBackground.tiles).toStrictEqual(['0', '1', '2', '3', '4', '5']);

    expect(customBackground.getTile(1, 1)).toBe('0');
    expect(customBackground.getTile(2, 1)).toBe('1');
    expect(customBackground.getTile(3, 1)).toBe('2');
    expect(customBackground.getTile(1, 2)).toBe('3');
    expect(customBackground.getTile(2, 2)).toBe('4');
    expect(customBackground.getTile(3, 2)).toBe('5');
});
