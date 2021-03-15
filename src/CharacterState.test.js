// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';
import SceneDimensions from './SceneDimensions';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, direction, path) {
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

test('CharacterState.pathEquals', () => {
    const oneSegment = [{x1: 100, y1: 200, x2: 300, y2: 400}];
    const twoSegments = [
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ];
    const sceneDimensions = new SceneDimensions(1000, 1000);

    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals([], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals(oneSegment, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals(oneSegment, 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 501, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 601, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 701, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 801}
    ], 1)).toBeFalsy();
});

test('CharacterState.getDirectionDegrees() should return the direction in degrees', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    expect(new CharacterState(1, 1, 0, [], sceneDimensions).getDirectionDegrees()).toBe(0);
    expect(new CharacterState(1, 1, 1, [], sceneDimensions).getDirectionDegrees()).toBe(45);
    expect(new CharacterState(1, 1, 2, [], sceneDimensions).getDirectionDegrees()).toBe(90);
    expect(new CharacterState(1, 1, 3, [], sceneDimensions).getDirectionDegrees()).toBe(135);
    expect(new CharacterState(1, 1, 4, [], sceneDimensions).getDirectionDegrees()).toBe(180);
    expect(new CharacterState(1, 1, 5, [], sceneDimensions).getDirectionDegrees()).toBe(225);
    expect(new CharacterState(1, 1, 6, [], sceneDimensions).getDirectionDegrees()).toBe(270);
    expect(new CharacterState(1, 1, 7, [], sceneDimensions).getDirectionDegrees()).toBe(315);
});

test('The character can move in 8 directions (N, NE, E, SE, S, SW, W, NW)', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    // N
    (expect(new CharacterState(200, 200, 0, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 0, [{x1: 200, y1: 200, x2: 200, y2: 100}]);
    // NE
    (expect(new CharacterState(100, 200, 1, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 1, [{x1: 100, y1: 200, x2: 200, y2: 100}]);
    // E
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 2, [{x1: 100, y1: 100, x2: 200, y2: 100}]);
    // SE
    (expect(new CharacterState(100, 100, 3, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 200, 3, [{x1: 100, y1: 100, x2: 200, y2: 200}]);
    // S
    (expect(new CharacterState(100, 100, 4, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 200, 4, [{x1: 100, y1: 100, x2: 100, y2: 200}]);
    // SW
    (expect(new CharacterState(200, 100, 5, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 200, 5, [{x1: 200, y1: 100, x2: 100, y2: 200}]);
    // W
    (expect(new CharacterState(200, 100, 6, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 6, [{x1: 200, y1: 100, x2: 100, y2: 100}]);
    // NW
    (expect(new CharacterState(200, 200, 7, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 7, [{x1: 200, y1: 200, x2: 100, y2: 100}]);
});

test('Turn Left moves anti-clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(1)): any)
        .toHaveCharacterState(1, 1, 2, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(4)): any)
        .toHaveCharacterState(1, 1, 7, []);
});

test('Turn Right moves clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(1)): any)
        .toHaveCharacterState(1, 1, 6, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(4)): any)
        .toHaveCharacterState(1, 1, 1, []);
});

test('Each Forward move should create a path segment', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).forward(100, true)): any)
        .toHaveCharacterState(300, 100, 2, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 300, y2: 100}
        ]);
    (expect(new CharacterState(100, 200, 2, [], sceneDimensions).forward(100, true).turnLeft(2).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 0, [
            {x1: 100, y1: 200, x2: 200, y2: 200},
            {x1: 200, y1: 200, x2: 200, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).turnRight(2).forward(100, true)): any)
        .toHaveCharacterState(200, 200, 4, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 200, y2: 200}
        ]);
});

test('Forward move should not create a path segment, when drawingEnabled is false', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false)): any)
        .toHaveCharacterState(200, 100, 2, []);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false).forward(200, true)): any)
        .toHaveCharacterState(400, 100, 2, [
            {x1: 200, y1: 100, x2: 400, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).forward(200, false)): any)
        .toHaveCharacterState(400, 100, 2, [
            {x1: 100, y1: 100, x2: 200, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false).forward(200, false)): any)
        .toHaveCharacterState(400, 100, 2, []);
});

test('Forward move is limited to the sceneDimensions', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(1, 1, 0, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(10, 1, 2, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(10, 1, 2, []);
    (expect(new CharacterState(1, 10, 4, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 10, 4, []);
    (expect(new CharacterState(1, 1, 6, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 1, 6, []);
});

test('Moving diagonally out of the scene will only move parallel to the edges of the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 1, 1, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(3, 1, 1, []);
    (expect(new CharacterState(2, 1, 7, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 1, 7, []);
    (expect(new CharacterState(10, 2, 1, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(10, 1, 1, []);
    (expect(new CharacterState(10, 2, 3, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(10, 3, 3, []);
    (expect(new CharacterState(2, 10, 3, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(3, 10, 3, []);
    (expect(new CharacterState(2, 10, 5, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 10, 5, []);
    (expect(new CharacterState(1, 2, 5, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 3, 5, []);
    (expect(new CharacterState(1, 2, 7, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 1, 7, []);
})

test('When direction is not an integer in range 0-7, forward() should throw an Error', () => {
    expect.assertions(3);

    const sceneDimensions = new SceneDimensions(200, 200);

    expect(() => {
        (new CharacterState(100, 100, -1, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 8, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 0.5, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);
});

test('MoveUpPosition moves the character up one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 2, 2, []);
    (expect(new CharacterState(2, 1, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 1, 2, []);
});

test('MoveRightPosition moves the character right one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(3, 3, 2, []);
    (expect(new CharacterState(10, 1, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(10, 1, 2, []);
});

test('MoveDownPosition moves the character down one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 4, 2, []);
    (expect(new CharacterState(2, 10, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 10, 2, []);
});

test('MoveLeftPosition moves the character Left one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 1, 2, []);
});

test('ChangeXPosition gets column label and updates xPosition', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('Z')): any)
        .toHaveCharacterState(26, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('z')): any)
        .toHaveCharacterState(26, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('A')): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('a')): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('3')): any)
        .toHaveCharacterState(2, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('Zz')): any)
        .toHaveCharacterState(2, 3, 2, []);
});

test('ChangeYPosition gets row label and updates yPosition', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(16)): any)
        .toHaveCharacterState(2, 16, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(1)): any)
        .toHaveCharacterState(2, 1, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(0)): any)
        .toHaveCharacterState(2, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(17)): any)
        .toHaveCharacterState(2, 3, 2, []);
});

test('getRowLabel returns current yPosition in string', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    expect(new CharacterState(2, 16, 2, [], sceneDimensions).getRowLabel()).toBe('16');
    expect(new CharacterState(2, 1, 2, [], sceneDimensions).getRowLabel()).toBe('1');
})

test('getColumnLabel returns current xPosition in string', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    expect(new CharacterState(26, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('Z');
    expect(new CharacterState(1, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('A');
})
