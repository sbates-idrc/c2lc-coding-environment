// @flow

import { getTileCodes, getTileColor, getTileImage, isNone, isWall } from './TileData';

import { ReactComponent as WallTileDefault } from './svg/WallTileDefault.svg';
import { ReactComponent as WallTileGray } from './svg/WallTileGray.svg';
import { ReactComponent as WallTileContrast } from './svg/WallTileContrast.svg';

test('isNone', () => {
    expect.assertions(14);
    expect(isNone('0')).toBe(true);
    for (const tileCode of getTileCodes()) {
        if (tileCode !== '0') {
            expect(isNone(tileCode)).toBe(false);
        }
    }
});

test('isWall', () => {
    expect.assertions(14);
    expect(isWall('1')).toBe(true);
    for (const tileCode of getTileCodes()) {
        if (tileCode !== '1') {
            expect(isWall(tileCode)).toBe(false);
        }
    }
});

test('getTileColor', () => {
    expect(getTileColor('B', 'default')).toBe('#DF86CB');
    expect(getTileColor('B', 'light')).toBe('#DF86CB');
    expect(getTileColor('B', 'dark')).toBe('#DF86CB');
    expect(getTileColor('B', 'gray')).toBe('#DCC6D7');
    expect(getTileColor('B', 'contrast')).toBe('#FF00C5');
});

test('getTileImage', () => {
    expect(getTileImage('1', 'default')).toBe(WallTileDefault);
    expect(getTileImage('1', 'light')).toBe(WallTileDefault);
    expect(getTileImage('1', 'dark')).toBe(WallTileDefault);
    expect(getTileImage('1', 'gray')).toBe(WallTileGray);
    expect(getTileImage('1', 'contrast')).toBe(WallTileContrast);
});
