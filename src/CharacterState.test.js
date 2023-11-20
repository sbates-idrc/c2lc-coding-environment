// @flow

import CharacterState from './CharacterState';
import type { CharacterEvent } from './CharacterState';
import * as C2lcMath from './C2lcMath';
import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';

// TODO: Test forward() and backward() with CustomBackground behaviour

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toBeCharacterState(received, xPos, yPos, direction, path) {
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.direction === direction
            && received.pathEquals(path, 0.0001);
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: true
            };
        } else {
            return {
                message: () => {
                    return 'Expected:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

expect.extend({
    toBeCharacterUpdate(received, xPos, yPos, direction, path, event: CharacterEvent) {
        const pass =
            C2lcMath.approxEqual(received.characterState.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.characterState.yPos, yPos, 0.0001)
            && received.characterState.direction === direction
            && received.characterState.pathEquals(path, 0.0001)
            && characterEventsEqual(received.event, event);
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `    event: ${JSON.stringify(event)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: true
            };
        } else {
            return {
                message: () => {
                    return 'Expected:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `    event: ${JSON.stringify(event)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

function characterEventsEqual(a: CharacterEvent, b: CharacterEvent): boolean {
    if (a === null && b === null) {
        return true;
    }

    if (a != null && b != null) {
        return a.type === b.type
            && a.x === b.x
            && a.y === b.y;
    }

    return false;
}

test('CharacterState.pathEquals', () => {
    const oneSegment = [{x1: 100, y1: 200, x2: 300, y2: 400}];
    const twoSegments = [
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ];
    const dimensions = new SceneDimensions(1, 1000, 1, 1000);

    expect(new CharacterState(0, 0, 0, [], dimensions).pathEquals([], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, [], dimensions).pathEquals(oneSegment, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, [], dimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, dimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, dimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals(oneSegment, 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, oneSegment, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 501, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 601, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 701, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, dimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 801}
    ], 1)).toBeFalsy();
});

test('CharacterState.getDirectionDegrees() should return the direction in degrees', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);
    expect(new CharacterState(1, 1, 0, [], dimensions).getDirectionDegrees()).toBe(0);
    expect(new CharacterState(1, 1, 1, [], dimensions).getDirectionDegrees()).toBe(45);
    expect(new CharacterState(1, 1, 2, [], dimensions).getDirectionDegrees()).toBe(90);
    expect(new CharacterState(1, 1, 3, [], dimensions).getDirectionDegrees()).toBe(135);
    expect(new CharacterState(1, 1, 4, [], dimensions).getDirectionDegrees()).toBe(180);
    expect(new CharacterState(1, 1, 5, [], dimensions).getDirectionDegrees()).toBe(225);
    expect(new CharacterState(1, 1, 6, [], dimensions).getDirectionDegrees()).toBe(270);
    expect(new CharacterState(1, 1, 7, [], dimensions).getDirectionDegrees()).toBe(315);
});

test('The character can move in 8 directions (N, NE, E, SE, S, SW, W, NW)', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);

    // N
    (expect(new CharacterState(2, 2, 0, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 0,[{x1: 2, y1: 2, x2: 2, y2: 1}], null);
    (expect(new CharacterState(2, 2, 4, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 4, [{x1: 2, y1: 2, x2: 2, y2: 1}], null);

    // NE
    (expect(new CharacterState(1, 2, 1, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 1, [{x1: 1, y1: 2, x2: 2, y2: 1}], null);
    (expect(new CharacterState(1, 2, 5, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 5, [{x1: 1, y1: 2, x2: 2, y2: 1}], null);

    // E
    (expect(new CharacterState(1, 1, 2, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);
    (expect(new CharacterState(1, 1, 6, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 6, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);

    // SE
    (expect(new CharacterState(1, 1, 3, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 2, 3, [{x1: 1, y1: 1, x2: 2, y2: 2}], null);
    (expect(new CharacterState(1, 1, 7, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 2, 7, [{x1: 1, y1: 1, x2: 2, y2: 2}], null);

    // S
    (expect(new CharacterState(1, 1, 4, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 2, 4, [{x1: 1, y1: 1, x2: 1, y2: 2}], null);
    (expect(new CharacterState(1, 1, 0, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 2, 0, [{x1: 1, y1: 1, x2: 1, y2: 2}], null);

    // SW
    (expect(new CharacterState(2, 1, 5, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 2, 5, [{x1: 2, y1: 1, x2: 1, y2: 2}], null);
    (expect(new CharacterState(2, 1, 1, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 2, 1, [{x1: 2, y1: 1, x2: 1, y2: 2}], null);

    // W
    (expect(new CharacterState(2, 1, 6, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 6, [{x1: 2, y1: 1, x2: 1, y2: 1}], null);
    (expect(new CharacterState(2, 1, 2, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 2, [{x1: 2, y1: 1, x2: 1, y2: 1}], null);

    // NW
    (expect(new CharacterState(2, 2, 7, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 7, [{x1: 2, y1: 2, x2: 1, y2: 1}], null);
    (expect(new CharacterState(2, 2, 3, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 3, [{x1: 2, y1: 2, x2: 1, y2: 1}], null);
});

test('Turn Left moves anti-clockwise and wraps at N', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(1, 1, 3, [], dimensions)
        .turnLeft(1)
    ): any).toBeCharacterState(1, 1, 2, []);

    (expect(new CharacterState(1, 1, 3, [], dimensions)
        .turnLeft(3)
    ): any).toBeCharacterState(1, 1, 0, []);

    (expect(new CharacterState(1, 1, 3, [], dimensions)
        .turnLeft(4)
    ): any).toBeCharacterState(1, 1, 7, []);
});

test('Turn Right moves clockwise and wraps at N', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(1, 1, 5, [], dimensions)
        .turnRight(1)
    ): any).toBeCharacterState(1, 1, 6, []);

    (expect(new CharacterState(1, 1, 5, [], dimensions)
        .turnRight(3)
    ): any).toBeCharacterState(1, 1, 0, []);

    (expect(new CharacterState(1, 1, 5, [], dimensions)
        .turnRight(4)
    ): any).toBeCharacterState(1, 1, 1, []);
});

test('Given an empty path, then moving Forward should add a new path segment', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(new CharacterState(1, 1, 2, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);
});

test('When moving Forward in the same direction, the path segment should be extended', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(
        new CharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(3, 1, 2, [{x1: 1, y1: 1, x2: 3, y2: 1}], null);
});

test('When moving Forward in a different direction, a new path segment should be added', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);

    (expect(
        new CharacterState(2, 2, 0, [{x1: 1, y1: 2, x2: 2, y2: 2}], dimensions)
            .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(
        2, 1, 0,
        [
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 2, y1: 2, x2: 2, y2: 1}
        ],
        null);

    (expect(
        new CharacterState(2, 1, 4, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(
        2, 2, 4,
        [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 2, y2: 2}
        ],
        null);
});

test('When Forward is retracing the last path segment, no path segment should be added', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(
        new CharacterState(1, 1, 2, [{x1: 2, y1: 1, x2: 1, y2: 1}], dimensions)
            .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 2, [{x1: 2, y1: 1, x2: 1, y2: 1}], null);
});

test('Given an empty path, then moving Backward should add a new path segment', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(new CharacterState(1, 1, 6, [], dimensions)
        .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 6, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);
});

test('When moving Backward in the same direction, the path segment should be extended', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(
        new CharacterState(2, 1, 6, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(3, 1, 6, [{x1: 1, y1: 1, x2: 3, y2: 1}], null);
});

test('When moving Backward in a different direction, a new path segment should be added', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);

    (expect(
        new CharacterState(2, 2, 4, [{x1: 1, y1: 2, x2: 2, y2: 2}], dimensions)
            .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(
        2, 1, 4,
        [
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 2, y1: 2, x2: 2, y2: 1}
        ],
        null);

    (expect(
        new CharacterState(2, 1, 0, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(
        2, 2, 0,
        [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 2, y2: 2}
        ],
        null);
});

test('When Backward is retracing the last path segment, no path segment should be added', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);
    (expect(
        new CharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .backward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);
});

test('Forward move should not create a path segment, when drawingEnabled is false', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);

    (expect(new CharacterState(1, 1, 2, [], dimensions)
        .forward(1, false, customBackground)
    ): any).toBeCharacterUpdate(2, 1, 2, [], null);

    (expect(
        new CharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], dimensions)
            .forward(2, false, customBackground)
    ): any).toBeCharacterUpdate(4, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], null);
});

test('Backward move should not create a path segment, when drawingEnabled is false', () => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions);

    (expect(new CharacterState(2, 1, 2, [], dimensions)
        .backward(1, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 2, [], null);

    (expect(
        new CharacterState(3, 1, 2, [{x1: 4, y1: 1, x2: 3, y2: 1}], dimensions)
            .backward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 2, [{x1: 4, y1: 1, x2: 3, y2: 1}], null);
});

test('Forward move is limited to the sceneDimensions', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);
    const customBackground = new CustomBackground(dimensions);

    (expect(new CharacterState(1, 1, 0, [], dimensions)
        .forward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 0, [], null);

    (expect(new CharacterState(9, 3, 1, [], dimensions)
        .forward(3, false, customBackground)
    ): any).toBeCharacterUpdate(10, 1, 1, [], null);

    (expect(new CharacterState(10, 1, 2, [], dimensions)
        .forward(2, false, customBackground)
    ): any).toBeCharacterUpdate(10, 1, 2, [], null);

    (expect(new CharacterState(9, 8, 3, [], dimensions)
        .forward(3, false, customBackground)
    ): any).toBeCharacterUpdate(10, 10, 3, [], null);

    (expect(new CharacterState(1, 10, 4, [], dimensions)
        .forward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 10, 4, [], null);

    (expect(new CharacterState(2, 8, 5, [], dimensions)
        .forward(3, false, customBackground)
    ): any).toBeCharacterUpdate(1, 10, 5, [], null);

    (expect(new CharacterState(1, 1, 6, [], dimensions)
        .forward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 6, [], null);

    (expect(new CharacterState(2, 3, 7, [], dimensions)
        .forward(3, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 7, [], null);
});

test('Backward move is limited to the sceneDimensions', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);
    const customBackground = new CustomBackground(dimensions);

    (expect(new CharacterState(1, 10, 0, [], dimensions)
        .backward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 10, 0, [], null);

    (expect(new CharacterState(2, 8, 1, [], dimensions)
        .backward(3, false, customBackground)
    ): any).toBeCharacterUpdate(1, 10, 1, [], null);

    (expect(new CharacterState(1, 1, 2, [], dimensions)
        .backward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 2, [], null);

    (expect(new CharacterState(2, 3, 3, [], dimensions)
        .backward(3, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 3, [], null);

    (expect(new CharacterState(1, 1, 4, [], dimensions)
        .backward(2, false, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 4, [], null);

    (expect(new CharacterState(9, 3, 5, [], dimensions)
        .backward(3, false, customBackground)
    ): any).toBeCharacterUpdate(10, 1, 5, [], null);

    (expect(new CharacterState(10, 1, 6, [], dimensions)
        .backward(2, false, customBackground)
    ): any).toBeCharacterUpdate(10, 1, 6, [], null);

    (expect(new CharacterState(9, 8, 7, [], dimensions)
        .backward(3, false, customBackground)
    ): any).toBeCharacterUpdate(10, 10, 7, [], null);
});

test('Moving diagonally out of the scene will only move parallel to the edges of the scene', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);
    const customBackground = new CustomBackground(dimensions);

    (expect(new CharacterState(2, 1, 1, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(3, 1, 1, [{x1: 2, y1: 1, x2: 3, y2: 1}], null);

    (expect(new CharacterState(9, 3, 1, [], dimensions)
        .forward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        10, 1, 1,
        [
            {x1: 9, y1: 3, x2: 10, y2: 2},
            {x1: 10, y1: 2, x2: 10, y2: 1}
        ],
        null);

    (expect(new CharacterState(2, 2, 1, [], dimensions)
        .backward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        1, 4, 1,
        [
            {x1: 2, y1: 2, x2: 1, y2: 3},
            {x1: 1, y1: 3, x2: 1, y2: 4}
        ],
        null);

    (expect(new CharacterState(10, 2, 3, [], dimensions)
        .forward(1, true, customBackground)
    ): any)
        .toBeCharacterUpdate(10, 3, 3, [{x1: 10, y1: 2, x2: 10, y2: 3}], null);

    (expect(new CharacterState(9, 3, 3, [], dimensions)
        .forward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        10, 5, 3,
        [
            {x1: 9, y1: 3, x2: 10, y2: 4},
            {x1: 10, y1: 4, x2: 10, y2: 5}
        ],
        null);

    (expect(new CharacterState(3, 2, 3, [], dimensions)
        .backward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        1, 1, 3,
        [
            {x1: 3, y1: 2, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ],
        null);

    (expect(new CharacterState(2, 10, 5, [], dimensions)
        .forward(1, true, customBackground)
    ): any)
        .toBeCharacterUpdate(1, 10, 5, [{x1: 2, y1: 10, x2: 1, y2: 10}], null);

    (expect(new CharacterState(2, 2, 5, [], dimensions)
        .forward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        1, 4, 5,
        [
            {x1: 2, y1: 2, x2: 1, y2: 3},
            {x1: 1, y1: 3, x2: 1, y2: 4}
        ],
        null);

    (expect(new CharacterState(2, 2, 5, [], dimensions)
        .backward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        4, 1, 5,
        [
            {x1: 2, y1: 2, x2: 3, y2: 1},
            {x1: 3, y1: 1, x2: 4, y2: 1}
        ],
        null);

    (expect(new CharacterState(1, 2, 7, [], dimensions)
        .forward(1, true, customBackground)
    ): any).toBeCharacterUpdate(1, 1, 7, [{x1: 1, y1: 2, x2: 1, y2: 1}], null);

    (expect(new CharacterState(3, 2, 7, [], dimensions)
        .forward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        1, 1, 7,
        [
            {x1: 3, y1: 2, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ],
        null);

    (expect(new CharacterState(9, 3, 7, [], dimensions)
        .backward(2, true, customBackground)
    ): any).toBeCharacterUpdate(
        10, 5, 7,
        [
            {x1: 9, y1: 3, x2: 10, y2: 4},
            {x1: 10, y1: 4, x2: 10, y2: 5}
        ],
        null);
})


test('When direction is not an integer in range 0-7, forward() and backward() should throw an Error', () => {
    expect.assertions(6);
    const dimensions = new SceneDimensions(1, 200, 1, 200);
    const customBackground = new CustomBackground(dimensions);

    expect(() => {
        (new CharacterState(1, 1, -1, [], dimensions))
            .forward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 8, [], dimensions))
            .forward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 0.5, [], dimensions))
            .forward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 8.5, [], dimensions))
            .backward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 3.5, [], dimensions))
            .backward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 0.5, [], dimensions))
            .backward(1, false, customBackground);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);
});

test('The number of path segments should be limited to maxPathLength', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);
    const customBackground = new CustomBackground(dimensions);

    const characterState = new CharacterState(
        1, 4, 2,
        [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 1, y1: 3, x2: 2, y2: 3}
        ],
        dimensions
    );

    characterState.maxPathLength = 3;

    (expect(characterState.forward(1, true, customBackground)): any)
        .toBeCharacterUpdate(
            2, 4, 2,
            [
                {x1: 1, y1: 2, x2: 2, y2: 2},
                {x1: 1, y1: 3, x2: 2, y2: 3},
                {x1: 1, y1: 4, x2: 2, y2: 4}
            ],
            null);
});

test('MoveUpPosition moves the character up one unit within the scene', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .moveUpPosition()
    ): any).toBeCharacterState(2, 2, 2, []);

    (expect(new CharacterState(2, 1, 2, [], dimensions)
        .moveUpPosition()
    ): any).toBeCharacterState(2, 1, 2, []);
});

test('MoveRightPosition moves the character right one unit within the scene', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .moveRightPosition()
    ): any).toBeCharacterState(3, 3, 2, []);

    (expect(new CharacterState(10, 1, 2, [], dimensions)
        .moveRightPosition()
    ): any).toBeCharacterState(10, 1, 2, []);
});

test('MoveDownPosition moves the character down one unit within the scene', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .moveDownPosition()
    ): any).toBeCharacterState(2, 4, 2, []);

    (expect(new CharacterState(2, 10, 2, [], dimensions)
        .moveDownPosition()
    ): any).toBeCharacterState(2, 10, 2, []);
});

test('MoveLeftPosition moves the character Left one unit within the scene', () => {
    const dimensions = new SceneDimensions(1, 10, 1, 10);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .moveLeftPosition()
    ): any).toBeCharacterState(1, 3, 2, []);

    (expect(new CharacterState(1, 1, 2, [], dimensions)
        .moveLeftPosition()
    ): any).toBeCharacterState(1, 1, 2, []);
});

test('ChangeXPosition gets column label and updates xPosition', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('Z')
    ): any).toBeCharacterState(26, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('z')
    ): any).toBeCharacterState(26, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('A')
    ): any).toBeCharacterState(1, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('a')
    ): any).toBeCharacterState(1, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('3')
    ): any).toBeCharacterState(2, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeXPosition('Zz')
    ): any).toBeCharacterState(2, 3, 2, []);
});

test('ChangeYPosition gets row label and updates yPosition', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeYPosition('16')
    ): any).toBeCharacterState(2, 16, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeYPosition('1')
    ): any).toBeCharacterState(2, 1, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeYPosition('0')
    ): any).toBeCharacterState(2, 3, 2, []);

    (expect(new CharacterState(2, 3, 2, [], dimensions)
        .changeYPosition('17')
    ): any).toBeCharacterState(2, 3, 2, []);
});

test('getRowLabel returns current yPosition in string', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new CharacterState(2, 16, 2, [], dimensions).getRowLabel()).toBe('16');
    expect(new CharacterState(2, 1, 2, [], dimensions).getRowLabel()).toBe('1');
})

test('getColumnLabel returns current xPosition in string', () => {
    const dimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new CharacterState(26, 3, 2, [], dimensions).getColumnLabel()).toBe('Z');
    expect(new CharacterState(1, 3, 2, [], dimensions).getColumnLabel()).toBe('A');
});
