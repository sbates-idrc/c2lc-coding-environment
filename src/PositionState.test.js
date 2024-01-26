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

test.each([
    ['A', 8, 1],
    ['B', 1, 2],
    ['H', 1, 8],
    ['I', 1, 1]
])('setXFromColumnLabel("%s")', (label, x, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(x, 11, dimensions).setXFromColumnLabel(label);
    expect(result.x).toBe(expectedX);
    expect(result.y).toBe(11);
    expect(result.sceneDimensions).toBe(dimensions);
});

test.each([
    ['11', 16, 11],
    ['12', 11, 12],
    ['16', 11, 16],
    ['17', 11, 11]
])('setYFromRowLabel("%s")', (label, y, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new PositionState(1, y, dimensions).setYFromRowLabel(label);
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
