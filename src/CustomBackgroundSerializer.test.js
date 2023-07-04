// @flow

import { CustomBackground } from './CustomBackground';
import CustomBackgroundSerializer from './CustomBackgroundSerializer';
import SceneDimensions from './SceneDimensions';

test('Serialize', () => {
    const dimensions = new SceneDimensions(1, 3, 1, 2);
    const serializer = new CustomBackgroundSerializer(dimensions);

    const customBackground = new CustomBackground(dimensions, '0');
    expect(serializer.serialize(customBackground)).toBe('000000');

    customBackground.setTile(1, 1, '0');
    customBackground.setTile(2, 1, '1');
    customBackground.setTile(3, 1, '2');
    customBackground.setTile(1, 2, '3');
    customBackground.setTile(2, 2, '4');
    customBackground.setTile(3, 2, '5');
    expect(serializer.serialize(customBackground)).toBe('012345');
});

test('Deserialize', () => {
    const dimensions = new SceneDimensions(1, 3, 1, 2);
    const serializer = new CustomBackgroundSerializer(dimensions);
    expect(serializer.deserialize(null).tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize(undefined).tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('').tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('0').tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('1').tiles).toStrictEqual(['1', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('01').tiles).toStrictEqual(['0', '1', '0', '0', '0', '0']);
    expect(serializer.deserialize('12345').tiles).toStrictEqual(['1', '2', '3', '4', '5', '0']);
    expect(serializer.deserialize('123456').tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
    expect(serializer.deserialize('1234567').tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
});
