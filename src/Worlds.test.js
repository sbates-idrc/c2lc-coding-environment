// @flow

import { getBackgroundInfo, getWorldCharacter, getWorldProperties, isWorldName } from './Worlds';

import { ReactComponent as Submarine } from './svg/Submarine.svg';
import { ReactComponent as SubmarineGray } from './svg/Submarine-gray.svg';
import { ReactComponent as SubmarineContrast } from './svg/Submarine-contrast.svg';

test('isWorldName', () => {
    expect.assertions(7);
    expect(isWorldName('DeepOcean')).toBe(true);
    expect(isWorldName('Jungle')).toBe(true);
    expect(isWorldName('Sketchpad')).toBe(true)
    expect(isWorldName('Space')).toBe(true);
    expect(isWorldName('')).toBe(false);
    expect(isWorldName(null)).toBe(false);
    expect(isWorldName('UNKNOWN')).toBe(false);
});

test('getWorldProperties', () => {
    expect.assertions(4);
    expect(getWorldProperties('DeepOcean')).not.toBeUndefined();
    expect(getWorldProperties('Jungle')).not.toBeUndefined();
    expect(getWorldProperties('Sketchpad')).not.toBeUndefined();
    expect(getWorldProperties('Space')).not.toBeUndefined();
});

test('getWorldCharacter', () => {
    expect.assertions(3);
    expect(getWorldCharacter('light', 'DeepOcean')).toBe(Submarine);
    expect(getWorldCharacter('gray', 'DeepOcean')).toBe(SubmarineGray);
    expect(getWorldCharacter('contrast', 'DeepOcean')).toBe(SubmarineContrast);
});

test('getBackgroundInfo', () => {
    expect(getBackgroundInfo('Sketchpad', 0, 1)).toBe(null);
    expect(getBackgroundInfo('Jungle', 0, 6)).toBe('Jungle.giraffe');
    expect(getBackgroundInfo('DeepOcean', 6, 7)).toBe('DeepOcean.treasure');
    expect(getBackgroundInfo('Space', 1, 0)).toBe('Space.earth');
});
