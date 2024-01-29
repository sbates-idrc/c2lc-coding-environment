// @flow

import PositionState from './PositionState';
import SceneDimensions from './SceneDimensions';

test('setPosition()', () => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(1, 11, dimensions).setPosition(8, 16);
    expect(result.x).toBe(8);
    expect(result.y).toBe(16);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [1, 2, 1],
    [2, 1, 2],
    [8, 1, 8],
    [0, 1, 1],
    [9, 1, 1]
])('setX(%d) with x=%d intially', (newX, initialX, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(initialX, 11, dimensions).setX(newX);
    expect(result.x).toBe(expectedX);
    expect(result.y).toBe(11);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [11, 12, 11],
    [12, 11, 12],
    [16, 11, 16],
    [10, 11, 11],
    [17, 11, 11]
])('setY(%d) with y=%d intially', (newY, initialY, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(1, initialY, dimensions).setY(newY);
    expect(result.x).toBe(1);
    expect(result.y).toBe(expectedY);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [3, 2],
    [2, 1],
    [1, 1]
])('moveLeft() with x=%d', (x, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(x, 11, dimensions).moveLeft();
    expect(result.x).toBe(expectedX);
    expect(result.y).toBe(11);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [6, 7],
    [7, 8],
    [8, 8]
])('moveRight() with x=%d', (x, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(x, 11, dimensions).moveRight();
    expect(result.x).toBe(expectedX);
    expect(result.y).toBe(11);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [13, 12],
    [12, 11],
    [11, 11]
])('moveUp() with y=%d', (y, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(1, y, dimensions).moveUp();
    expect(result.x).toBe(1);
    expect(result.y).toBe(expectedY);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    [14, 15],
    [15, 16],
    [16, 16]
])('moveDown() with y=%d', (y, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(1, y, dimensions).moveDown();
    expect(result.x).toBe(1);
    expect(result.y).toBe(expectedY);
    expect(result.sceneDimensions).toBe(dimensions);
});

test('getColumnLabel()', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new PositionState(1, 2, dimensions).getColumnLabel()).toBe('A');
    expect(new PositionState(26, 2, dimensions).getColumnLabel()).toBe('Z');
});

test('getRowLabel()', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new PositionState(2, 1, dimensions).getRowLabel()).toBe('1');
    expect(new PositionState(2, 16, dimensions).getRowLabel()).toBe('16');
});
