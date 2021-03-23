// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import Scene from './Scene';
import type {SceneProps} from './Scene';
import SceneDimensions from './SceneDimensions';
import CharacterState from './CharacterState';

configure({ adapter: new Adapter() });

const defaultSceneProps = {
    dimensions: new SceneDimensions(1, 1),
    characterState: new CharacterState(0, 0, 2, []),
    theme: 'default'
};

function createMountScene(props) {
    const wrapper = mount(
        React.createElement(
            Scene,
            (Object.assign(
                {},
                defaultSceneProps,
                props
            ):SceneProps)
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return wrapper;
}

function findScene(sceneWrapper) {
    return sceneWrapper.find('.Scene');
}

function findGridLines(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-line');
}

function findGridLabels(sceneWrapper) {
    return sceneWrapper.find('.Scene__grid-label');
}

function findCharacter(sceneWrapper) {
    return sceneWrapper.find('.Character');
}

function findCharacterIcon(sceneWrapper) {
    return sceneWrapper.find('.Character__icon');
}

function findCharacterPath(sceneWrapper) {
    return sceneWrapper.find('.Scene__path-line');
}

// TODO: This function is reproducing logic from Scene (the 0.8) and
//       Character (everything else) and it will be easily
//       broken. Is there a better approach here that tests that the
//       character is rendered as expected, but it less brittle?
function calculateCharacterDimensions() {
    const characterWidth = 0.9;
    const x = -characterWidth/2;
    const y = -characterWidth/2;
    const width = characterWidth;
    const height = characterWidth;
    return { x, y, width, height };
}

describe('When the Scene renders', () => {
    test('With width = 0, height = 2', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(0, 2)
        });
        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With width = 2, height = 0', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(2, 0)
        });
        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With width = 1, height = 1', () => {
        //expect.assertions(7);
        const dimensions = new SceneDimensions(1, 1);
        const sceneWrapper = createMountScene({
            dimensions: dimensions
        });
        const expectedLabelOffset = 0.025;

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX()} ${dimensions.getMinY()} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(2);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(0.5 - expectedLabelOffset);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(1);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(1);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(0.5 - expectedLabelOffset);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With width = 3, height = 2', () => {
        expect.assertions(25);
        const dimensions = new SceneDimensions(3, 2);
        const sceneWrapper = createMountScene({
            dimensions: dimensions
        });
        const expectedRowLabelOffset = 0.075;
        const expectedColumnLabelOffset = 0.05;

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX()} ${dimensions.getMinY()} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(5);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(0.5 - expectedRowLabelOffset);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(1);
        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(0.5 - expectedRowLabelOffset);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(2);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(2).props.x).toBe(1);
        expect(findGridLabels(sceneWrapper).get(2).props.y).toBe(0.5 - expectedColumnLabelOffset);
        expect(findGridLabels(sceneWrapper).get(3).props.x).toBe(2);
        expect(findGridLabels(sceneWrapper).get(3).props.y).toBe(0.5 - expectedColumnLabelOffset);
        expect(findGridLabels(sceneWrapper).get(4).props.x).toBe(3);
        expect(findGridLabels(sceneWrapper).get(4).props.y).toBe(0.5 - expectedColumnLabelOffset);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(3);

        // Grid rows

        expect(findGridLines(sceneWrapper).get(0).props.x1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(0).props.y1).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(0).props.x2).toBe(3.5);
        expect(findGridLines(sceneWrapper).get(0).props.y2).toBe(1.5);

        // Grid columns

        expect(findGridLines(sceneWrapper).get(1).props.x1).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(1).props.y1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(1).props.x2).toBe(1.5);
        expect(findGridLines(sceneWrapper).get(1).props.y2).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.x1).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.y1).toBe(0.5);
        expect(findGridLines(sceneWrapper).get(2).props.x2).toBe(2.5);
        expect(findGridLines(sceneWrapper).get(2).props.y2).toBe(2.5);
    });
});

describe('The ARIA label should tell there is a character with its position', () => {
    test.each([
        [1, 2, 0, 'Scene, 17 by 9 grid with a character at column A, row 2 facing up'],
        [2, 3, 1, 'Scene, 17 by 9 grid with a character at column B, row 3 facing upper right'],
        [1, 2, 2, 'Scene, 17 by 9 grid with a character at column A, row 2 facing right'],
        [1, 2, 3, 'Scene, 17 by 9 grid with a character at column A, row 2 facing lower right'],
        [1, 2, 4, 'Scene, 17 by 9 grid with a character at column A, row 2 facing down'],
        [1, 2, 5, 'Scene, 17 by 9 grid with a character at column A, row 2 facing lower left'],
        [1, 2, 6, 'Scene, 17 by 9 grid with a character at column A, row 2 facing left'],
        [1, 2, 7, 'Scene, 17 by 9 grid with a character at column A, row 2 facing upper left'],
        [   1, -10, 0, 'Scene, 17 by 9 grid with a character outside of the scene above the scene, facing up'],
        [ 100, -10, 6, 'Scene, 17 by 9 grid with a character outside of the scene to the upper right of the scene, facing left'],
        [ 100,   1, 0, 'Scene, 17 by 9 grid with a character outside of the scene to the right of the scene, facing up'],
        [ 100,  10, 0, 'Scene, 17 by 9 grid with a character outside of the scene to the lower right of the scene, facing up'],
        [   1,  10, 0, 'Scene, 17 by 9 grid with a character outside of the scene below the scene, facing up'],
        [-100,  10, 0, 'Scene, 17 by 9 grid with a character outside of the scene to the lower left of the scene, facing up'],
        [-100,   1, 0, 'Scene, 17 by 9 grid with a character outside of the scene to the left of the scene, facing up'],
        [-100, -10, 0, 'Scene, 17 by 9 grid with a character outside of the scene to the upper left of the scene, facing up']
    ])('x=%f, y=%f, direction=%i', (x, y, direction, expectedLabel) => {
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(17, 9),
            characterState: new CharacterState(x, y, direction, [])
        });
        expect(findScene(sceneWrapper).get(0).props['aria-label']).toBe(expectedLabel);
    });
});

describe('When the Scene renders', () => {
    test('Should render the character component', () => {
        expect.assertions(5);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(1, 1)
        });
        const expectedCharacterDimensions = calculateCharacterDimensions();
        expect(findCharacterIcon(sceneWrapper).hostNodes().length).toBe(1);
        expect(findCharacterIcon(sceneWrapper).get(0).props.x)
            .toBeCloseTo(expectedCharacterDimensions.x, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.y)
            .toBeCloseTo(expectedCharacterDimensions.y, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.width)
            .toBeCloseTo(expectedCharacterDimensions.width, 5);
        expect(findCharacterIcon(sceneWrapper).get(0).props.height)
            .toBeCloseTo(expectedCharacterDimensions.height, 5);
    });
});

describe('When the character renders, transform should apply', () => {
    test('When xPos = 1, yPos = 1, direction = 2', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(1, 1),
            characterState: new CharacterState(1, 1, 2, [])
        });
        const character = findCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(1 1) rotate(0 0 0)');
    });
    test('When xPos = 10, yPos = 8, direction = 4', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(20, 20),
            characterState: new CharacterState(10, 8, 4, [])
        });
        const character = findCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(10 8) rotate(90 0 0)');
    });
    test('When xPos = 1, yPos = 9, direction = 0', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: new SceneDimensions(20, 20),
            characterState: new CharacterState(1, 9, 0, [])
        });
        const character = findCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(1 9) rotate(-90 0 0)');
    });
});

describe('Draw character when out of bounds', () => {
    test.each([
        [  1, -2,  1  , 0.6 ], // N
        [  6, -2,  5.4, 0.6 ], // NE
        [  6,  1,  5.4,  1   ], // E
        [  6,  4,  5.4,  3.4 ], // SE
        [  1,  4,  1  ,  3.4 ], // S
        [ -3,  4, 0.6,  3.4], // SW
        [ -3,  1, 0.6,  1   ], // W
        [ -3, -2, 0.6, 0.6 ]  // NW
    ])('x=%f, y=%f, expectedDrawX=%f, expectedDrawY=%f',
        (x, y, expectedDrawX, expectedDrawY) => {
            const sceneWrapper = createMountScene({
                dimensions: new SceneDimensions(5, 3),
                characterState: new CharacterState(x, y, 2, [])
            });
            const character = findCharacter(sceneWrapper);
            expect(character.get(0).props.transform)
                .toBe(`translate(${expectedDrawX} ${expectedDrawY}) rotate(0 0 0)`);
        }
    );
});

describe('When the Character has a path, it is drawn on the Scene', () => {
    test('When there is no path segment', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            characterState: new CharacterState(0, 0, 2, [])
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(0);
    });

    test('When there is one path segment', () => {
        expect.assertions(5);
        const sceneWrapper = createMountScene({
            characterState: new CharacterState(0, 0, 2, [{x1: 100, y1: 200, x2: 300, y2: 400}])
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(1);
        expect(characterPath.get(0).props.x1).toBe(100);
        expect(characterPath.get(0).props.y1).toBe(200);
        expect(characterPath.get(0).props.x2).toBe(300);
        expect(characterPath.get(0).props.y2).toBe(400);
    });

    test('When there are two path segments', () => {
        expect.assertions(9);
        const sceneWrapper = createMountScene({
            characterState:
                new CharacterState(0, 0, 2, [
                    {x1: 100, y1: 200, x2: 300, y2: 400},
                    {x1: 500, y1: 600, x2: 700, y2: 800}
                ])
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(2);
        expect(characterPath.get(0).props.x1).toBe(100);
        expect(characterPath.get(0).props.y1).toBe(200);
        expect(characterPath.get(0).props.x2).toBe(300);
        expect(characterPath.get(0).props.y2).toBe(400);
        expect(characterPath.get(1).props.x1).toBe(500);
        expect(characterPath.get(1).props.y1).toBe(600);
        expect(characterPath.get(1).props.x2).toBe(700);
        expect(characterPath.get(1).props.y2).toBe(800);
    })
})
