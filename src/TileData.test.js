// @flow

import { getTileColor } from './TileData';

test('getTileColor', () => {
    expect(getTileColor('B', 'default')).toBe('#DF86CB');
    expect(getTileColor('B', 'light')).toBe('#DF86CB');
    expect(getTileColor('B', 'dark')).toBe('#DF86CB');
    expect(getTileColor('B', 'gray')).toBe('#DCC6D7');
    expect(getTileColor('B', 'contrast')).toBe('#FF00C5');
});
