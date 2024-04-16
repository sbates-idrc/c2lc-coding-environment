// @flow

import { getBackgroundInfo, getWorldCharacter, getWorldThumbnail, getWorldProperties, isWorldName } from './Worlds';

import { ReactComponent as DeepOceanSubmarine } from './svg/DeepOceanSubmarine.svg';
import { ReactComponent as DeepOceanSubmarineGray } from './svg/DeepOceanSubmarine-gray.svg';
import { ReactComponent as DeepOceanSubmarineContrast } from './svg/DeepOceanSubmarine-contrast.svg';

import { ReactComponent as SpaceThumbnail } from './svg/SpaceThumbnail.svg';
import { ReactComponent as SpaceThumbnailGray } from './svg/SpaceThumbnail-gray.svg';
import { ReactComponent as SpaceThumbnailContrast } from './svg/SpaceThumbnail-contrast.svg';

import { ReactComponent as SketchpadThumbnailDark } from './svg/SketchpadThumbnail-dark.svg';

test('isWorldName', () => {
    expect.assertions(7);
    expect(isWorldName('DeepOcean')).toBe(true);
    expect(isWorldName('Savannah')).toBe(true);
    expect(isWorldName('Sketchpad')).toBe(true)
    expect(isWorldName('Space')).toBe(true);
    expect(isWorldName('')).toBe(false);
    expect(isWorldName(null)).toBe(false);
    expect(isWorldName('UNKNOWN')).toBe(false);
});

test('getWorldProperties', () => {
    expect.assertions(4);
    expect(getWorldProperties('DeepOcean')).not.toBeUndefined();
    expect(getWorldProperties('Savannah')).not.toBeUndefined();
    expect(getWorldProperties('Sketchpad')).not.toBeUndefined();
    expect(getWorldProperties('Space')).not.toBeUndefined();
});

test('getWorldCharacter', () => {
    expect.assertions(3);
    expect(getWorldCharacter('light', 'DeepOcean')).toBe(DeepOceanSubmarine);
    expect(getWorldCharacter('gray', 'DeepOcean')).toBe(DeepOceanSubmarineGray);
    expect(getWorldCharacter('contrast', 'DeepOcean')).toBe(DeepOceanSubmarineContrast);
});

test('getWorldThumbnail', () => {
    expect.assertions(5);
    expect(getWorldThumbnail('dark', 'Sketchpad')).toBe(SketchpadThumbnailDark);
    expect(getWorldThumbnail('light', 'Space')).toBe(SpaceThumbnail);
    expect(getWorldThumbnail('gray', 'Space')).toBe(SpaceThumbnailGray);
    expect(getWorldThumbnail('contrast', 'Space')).toBe(SpaceThumbnailContrast);
    expect(getWorldThumbnail('dark', 'Space')).toBe(SpaceThumbnail);
})
test('getBackgroundInfo', () => {
    expect.assertions(5);
    expect(getBackgroundInfo('DeepOcean', 'I', '7')).toBe('treasure');
    expect(getBackgroundInfo('Savannah', 'G', '1')).toBe('giraffe');
    expect(getBackgroundInfo('Sketchpad', 'B', '1')).toBe(null);
    expect(getBackgroundInfo('Space', 'A', '1')).toBe('earth');
    expect(getBackgroundInfo('Space', 'G', '1')).toBe(null);
});
