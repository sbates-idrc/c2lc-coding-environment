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

test('SceneDimensions.getXFromColumnLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    (expect(dimensions.getXFromColumnLabel('A')): any).toBe(1);
    (expect(dimensions.getXFromColumnLabel('a')): any).toBe(1);
    (expect(dimensions.getXFromColumnLabel('E')): any).toBe(5);
    (expect(dimensions.getXFromColumnLabel('e')): any).toBe(5);
    (expect(dimensions.getXFromColumnLabel('F')): any).toBeNull();
    (expect(dimensions.getXFromColumnLabel('1')): any).toBeNull();
    (expect(dimensions.getXFromColumnLabel('@')): any).toBeNull();
    (expect(dimensions.getXFromColumnLabel('')): any).toBeNull();
    (expect(dimensions.getXFromColumnLabel(' ')): any).toBeNull();
    (expect(dimensions.getXFromColumnLabel('AA')): any).toBeNull();
});

test('SceneDimensions.getYFromRowLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    (expect(dimensions.getYFromRowLabel('1')): any).toBe(1);
    (expect(dimensions.getYFromRowLabel('2')): any).toBe(2);
    (expect(dimensions.getYFromRowLabel('3')): any).toBe(3);
    (expect(dimensions.getYFromRowLabel('4')): any).toBeNull();
    (expect(dimensions.getYFromRowLabel('0')): any).toBeNull();
    (expect(dimensions.getYFromRowLabel('')): any).toBeNull();
    (expect(dimensions.getYFromRowLabel(' ')): any).toBeNull();
    (expect(dimensions.getYFromRowLabel('A')): any).toBeNull();
});

test('SceneDimensions.getColumnLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getColumnLabel(1)).toBe('A');
    expect(dimensions.getColumnLabel(5)).toBe('E');
});

test('SceneDimensions.getRowLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getRowLabel(1)).toBe('1');
    expect(dimensions.getRowLabel(3)).toBe('3');
});
