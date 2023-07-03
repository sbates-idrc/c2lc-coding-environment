// @flow

import CustomBackgroundSerializer from './CustomBackgroundSerializer';
import SceneDimensions from './SceneDimensions';

test('Deserialize', () => {
    const dimensions = new SceneDimensions(1, 3, 1, 2);
    const serializer = new CustomBackgroundSerializer(dimensions);
    expect(serializer.deserialize(null).tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize(undefined).tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('').tiles).toStrictEqual(['0', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('1').tiles).toStrictEqual(['1', '0', '0', '0', '0', '0']);
    expect(serializer.deserialize('12345').tiles).toStrictEqual(['1', '2', '3', '4', '5', '0']);
    expect(serializer.deserialize('123456').tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
    expect(serializer.deserialize('1234567').tiles).toStrictEqual(['1', '2', '3', '4', '5', '6']);
});
