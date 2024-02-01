// @flow

import CharacterState from './CharacterState';
import type { CharacterEvent } from './CharacterState';
import * as C2lcMath from './C2lcMath';
import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';
import type { PathSegment } from './types';

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


type MovementTestCase = {|
    name: string,
    x: number,
    y: number,
    direction: number,
    path: Array<PathSegment>,
    distance: number,
    drawingEnabled: boolean,
    expectedX: number,
    expectedY: number,
    expectedPath: Array<PathSegment>,
    expectedEvent: ?CharacterEvent
|};

const movementTestCases: Array<MovementTestCase> = [
    {
        name: 'Empty path, drawingEnabled=true, distance=1: adds a new path segment',
        x: 1,
        y: 1,
        direction: 2,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 2,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=3: adds a new path segment',
        x: 1,
        y: 1,
        direction: 2,
        path: [],
        distance: 3,
        drawingEnabled: true,
        expectedX: 4,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 4, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Non-empty path, drawing in the same direction, distance=1: the path segment is extended',
        x: 2,
        y: 1,
        direction: 2,
        path: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        distance: 1,
        drawingEnabled: true,
        expectedX: 3,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 3, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Non-empty path, drawing in the same direction, distance=3: the path segment is extended',
        x: 2,
        y: 1,
        direction: 2,
        path: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        distance: 3,
        drawingEnabled: true,
        expectedX: 5,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 5, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Non-empty path, drawing in a different direction: a new path segment is added',
        x: 2,
        y: 1,
        direction: 4,
        path: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        distance: 1,
        drawingEnabled: true,
        expectedX: 2,
        expectedY: 2,
        expectedPath: [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 2, y2: 2}
        ],
        expectedEvent: null
    },
    {
        name: 'When drawing is retracing the last path segment, no path segment is added',
        x: 2,
        y: 1,
        direction: 6,
        path: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        distance: 1,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Empty path, drawingEnabled=false, distance=1: no path segment is added',
        x: 1,
        y: 1,
        direction: 2,
        path: [],
        distance: 1,
        drawingEnabled: false,
        expectedX: 2,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: null
    },
    {
        name: 'Empty path, drawingEnabled=false, distance=3: no path segment is added',
        x: 1,
        y: 1,
        direction: 2,
        path: [],
        distance: 3,
        drawingEnabled: false,
        expectedX: 4,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: null
    },
    {
        name: 'Non-empty path, drawingEnabled=false: no path segment is added',
        x: 2,
        y: 1,
        direction: 2,
        path: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        distance: 1,
        drawingEnabled: false,
        expectedX: 3,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 1, x2: 2, y2: 1}],
        expectedEvent: null
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=1, reach the N end of the scene: the character is stopped at the edge of the scene and no path is drawn',
        x: 1,
        y: 1,
        direction: 0,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 1
        }
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=3, reach the N end of the scene immediately: the character is stopped at the edge of the scene and no path is drawn',
        x: 1,
        y: 1,
        direction: 0,
        path: [],
        distance: 3,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 1
        }
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=3, reach the N end of the scene during movement: the character is stopped at the edge of the scene and the path is partially drawn',
        x: 1,
        y: 3,
        direction: 0,
        path: [],
        distance: 3,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [{x1: 1, y1: 3, x2: 1, y2: 1}],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 1
        }
    },
    {
        name: 'Empty path, drawingEnabled=false, distance=3, reach the N end of the scene during movement: the character is stopped at the edge of the scene',
        x: 1,
        y: 3,
        direction: 0,
        path: [],
        distance: 3,
        drawingEnabled: false,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 1
        }
    },
    {
        name: 'Reach the E end of the scene',
        x: 5,
        y: 1,
        direction: 2,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 5,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 5,
            y: 1
        }
    },
    {
        name: 'Reach the S end of the scene',
        x: 1,
        y: 5,
        direction: 4,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 5,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 5
        }
    },
    {
        name: 'Reach the W end of the scene',
        x: 1,
        y: 1,
        direction: 6,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 1,
        expectedY: 1,
        expectedPath: [],
        expectedEvent: {
            type: 'endOfScene',
            x: 1,
            y: 1
        }
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=1, hit a wall: the character is stopped by the wall and no path is drawn',
        x: 3,
        y: 5,
        direction: 2,
        path: [],
        distance: 1,
        drawingEnabled: true,
        expectedX: 3,
        expectedY: 5,
        expectedPath: [],
        expectedEvent: {
            type: 'hitWall',
            x: 4,
            y: 5
        }
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=3, hit a wall immediately: the character is stopped by the wall and no path is drawn',
        x: 3,
        y: 5,
        direction: 2,
        path: [],
        distance: 3,
        drawingEnabled: true,
        expectedX: 3,
        expectedY: 5,
        expectedPath: [],
        expectedEvent: {
            type: 'hitWall',
            x: 4,
            y: 5
        }
    },
    {
        name: 'Empty path, drawingEnabled=true, distance=3, hit a wall during movement: the character is stopped by the wall and the path is partially drawn',
        x: 1,
        y: 5,
        direction: 2,
        path: [],
        distance: 3,
        drawingEnabled: true,
        expectedX: 3,
        expectedY: 5,
        expectedPath: [{x1: 1, y1: 5, x2: 3, y2: 5}],
        expectedEvent: {
            type: 'hitWall',
            x: 4,
            y: 5
        }
    },
    {
        name: 'Empty path, drawingEnabled=false, distance=3, hit a wall during movement: the character is stopped by the wall',
        x: 1,
        y: 5,
        direction: 2,
        path: [],
        distance: 3,
        drawingEnabled: false,
        expectedX: 3,
        expectedY: 5,
        expectedPath: [],
        expectedEvent: {
            type: 'hitWall',
            x: 4,
            y: 5
        }
    }
];

test.each(movementTestCases)('Forward: $name', (testData: MovementTestCase) => {
    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions, [
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '1', '0'
    ]);

    (expect(
        new CharacterState(
            testData.x,
            testData.y,
            testData.direction,
            testData.path,
            dimensions
        ).forward(testData.distance, testData.drawingEnabled, customBackground)
    ): any).toBeCharacterUpdate(
        testData.expectedX,
        testData.expectedY,
        testData.direction,
        testData.expectedPath,
        testData.expectedEvent);
});

test.each(movementTestCases)('Backward: $name', (testData: MovementTestCase) => {
    // Reuse the same test cases for moving backward, with the direction
    // reversed
    const direction = (testData.direction + 4) % 8;

    const dimensions = new SceneDimensions(1, 5, 1, 5);
    const customBackground = new CustomBackground(dimensions, [
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '0', '0',
        '0', '0', '0', '1', '0'
    ]);

    (expect(
        new CharacterState(
            testData.x,
            testData.y,
            direction,
            testData.path,
            dimensions
        ).backward(testData.distance, testData.drawingEnabled, customBackground)
    ): any).toBeCharacterUpdate(
        testData.expectedX,
        testData.expectedY,
        direction,
        testData.expectedPath,
        testData.expectedEvent);
});

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

test.each([
    [13, 12],
    [12, 11],
    [11, 11]
])('moveUpPosition() with y=%d', (y, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(1, y, 2, [], dimensions).moveUpPosition();
    (expect(result): any).toBeCharacterState(1, expectedY, 2, []);
});

test.each([
    [6, 7],
    [7, 8],
    [8, 8]
])('moveRightPosition() with x=%d', (x, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(x, 11, 2, [], dimensions).moveRightPosition();
    (expect(result): any).toBeCharacterState(expectedX, 11, 2, []);
});

test.each([
    [14, 15],
    [15, 16],
    [16, 16]
])('moveDownPosition() with y=%d', (y, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(1, y, 2, [], dimensions).moveDownPosition();
    (expect(result): any).toBeCharacterState(1, expectedY, 2, []);
});

test.each([
    [3, 2],
    [2, 1],
    [1, 1]
])('moveLeftPosition() with x=%d', (x, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(x, 11, 2, [], dimensions).moveLeftPosition();
    (expect(result): any).toBeCharacterState(expectedX, 11, 2, []);
});

test.each([
    [1, 2, 1],
    [2, 1, 2],
    [8, 1, 8],
    [0, 1, 1],
    [9, 1, 1]
])('changeXPosition(%d) with x=%d intially', (newX, initialX, expectedX) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(initialX, 11, 2, [], dimensions).changeXPosition(newX);
    (expect(result): any).toBeCharacterState(expectedX, 11, 2, []);
});

test.each([
    [11, 12, 11],
    [12, 11, 12],
    [16, 11, 16],
    [10, 11, 11],
    [17, 11, 11]
])('changeYPosition(%d) with y=%d intially', (newY, initialY, expectedY) => {
    const dimensions = new SceneDimensions(1, 8, 11, 16);
    const result = new CharacterState(1, initialY, 2, [], dimensions).changeYPosition(newY);
    (expect(result): any).toBeCharacterState(1, expectedY, 2, []);
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
