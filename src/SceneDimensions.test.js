// @flow

import SceneDimensions from './SceneDimensions';

test('SceneDimensions properties', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.getWidth()).toBe(8);
    expect(dimensions.getHeight()).toBe(6);
    expect(dimensions.getMinX()).toBe(1);
    expect(dimensions.getMinY()).toBe(11);
    expect(dimensions.getMaxX()).toBe(8);
    expect(dimensions.getMaxY()).toBe(16);
});

test('isXInRange()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.isXInRange(0)).toBe(false);
    expect(dimensions.isXInRange(1)).toBe(true);
    expect(dimensions.isXInRange(2)).toBe(true);
    expect(dimensions.isXInRange(7)).toBe(true);
    expect(dimensions.isXInRange(8)).toBe(true);
    expect(dimensions.isXInRange(9)).toBe(false);
});

test('isYInRange()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.isYInRange(10)).toBe(false);
    expect(dimensions.isYInRange(11)).toBe(true);
    expect(dimensions.isYInRange(12)).toBe(true);
    expect(dimensions.isYInRange(15)).toBe(true);
    expect(dimensions.isYInRange(16)).toBe(true);
    expect(dimensions.isYInRange(17)).toBe(false);
});

test('moveLeft()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.moveLeft(3)).toBe(2);
    expect(dimensions.moveLeft(2)).toBe(1);
    expect(dimensions.moveLeft(1)).toBe(1);
});

test('moveRight()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.moveRight(6)).toBe(7);
    expect(dimensions.moveRight(7)).toBe(8);
    expect(dimensions.moveRight(8)).toBe(8);
});

test('moveUp()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.moveUp(13)).toBe(12);
    expect(dimensions.moveUp(12)).toBe(11);
    expect(dimensions.moveUp(11)).toBe(11);
});

test('moveDown()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    expect(dimensions.moveDown(14)).toBe(15);
    expect(dimensions.moveDown(15)).toBe(16);
    expect(dimensions.moveDown(16)).toBe(16);
});

test('getXFromColumnLabel()', () => {
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

test('getYFromRowLabel()', () => {
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

test('getColumnLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getColumnLabel(1)).toBe('A');
    expect(dimensions.getColumnLabel(5)).toBe('E');
    expect(dimensions.getColumnLabel(0)).toBeNull();
    expect(dimensions.getColumnLabel(6)).toBeNull();
});

test('getRowLabel()', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 3);
    expect(dimensions.getRowLabel(1)).toBe('1');
    expect(dimensions.getRowLabel(3)).toBe('3');
    expect(dimensions.getRowLabel(0)).toBeNull();
    expect(dimensions.getRowLabel(4)).toBeNull();
});
