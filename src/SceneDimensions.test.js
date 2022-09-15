// @flow

import SceneDimensions from './SceneDimensions';

test('SceneDimensions properties', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getWidth()).toBe(5);
    expect(dimensions.getHeight()).toBe(3);
    expect(dimensions.getMinX()).toBe(1);
    expect(dimensions.getMinY()).toBe(1);
    expect(dimensions.getMaxX()).toBe(5);
    expect(dimensions.getMaxY()).toBe(3);
});

test('SceneDimensions.getBoundsStateX()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getBoundsStateX(1)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(3)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(6.5)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateX(-2.51)).toBe('outOfBoundsBelow');
});

test('SceneDimensions.getBoundsStateY()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getBoundsStateY(1)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(1.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(4)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateY(-1.51)).toBe('outOfBoundsBelow');
});
