// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import messages from './messages.json';
import Scene from './Scene';
import type {SceneProps} from './Scene';
import SceneDimensions from './SceneDimensions';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import DesignModeCursorState from './DesignModeCursorState';

configure({ adapter: new Adapter() });

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

const defaultDimensions = new SceneDimensions(1, 1, 1, 1);

const defaultSceneProps = {
    dimensions: defaultDimensions,
    characterState: new CharacterState(1, 1, 2, [], defaultDimensions),
    designModeCursorState: new DesignModeCursorState(1, 1, defaultDimensions),
    theme: 'default',
    world: 'Sketchpad',
    customBackground: new CustomBackground(defaultDimensions),
    customBackgroundDesignMode: false,
    startingX: 1,
    startingY: 2,
    characterDescriptionBuilder: new CharacterDescriptionBuilder(intl)
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

function findSceneCharacter(sceneWrapper) {
    return sceneWrapper.find('.SceneCharacter');
}

function findSceneCharacterIcon(sceneWrapper) {
    return sceneWrapper.find('.SceneCharacter__icon');
}

function findCharacterPath(sceneWrapper) {
    return sceneWrapper.find('.Scene__path-line');
}

function findRowHeader(sceneWrapper) {
    return sceneWrapper.find('.Scene__row-header');
}

function findColumnHeader(sceneWrapper) {
    return sceneWrapper.find('.Scene__column-header');
}

function findSceneBackground(sceneWrapper) {
    return sceneWrapper.find('.Scene__background');
}

function findStartIndicator(sceneWrapper) {
    return sceneWrapper.find('svg.Scene__startIndicator');
}

function findCharacterOutline(sceneWrapper) {
    return sceneWrapper.find('.Scene__characterOutline');
}

function findDesignModeCursor(sceneWrapper) {
    return sceneWrapper.find('svg.Scene__designModeCursor');
}

// TODO: This function is reproducing logic from Scene (the 0.9) and
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
    test('With width = 1, height = 1', () => {
        expect.assertions(7);
        const dimensions = new SceneDimensions(1, 1, 1, 1);
        const sceneWrapper = createMountScene({
            dimensions: dimensions,
            customBackground: new CustomBackground(dimensions)
        });

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX() - 0.5} ${dimensions.getMinY() - 0.5} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(2);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(5);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(5);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(0.5);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With width = 3, height = 2', () => {
        expect.assertions(25);
        const dimensions = new SceneDimensions(1, 3, 1, 2);
        const sceneWrapper = createMountScene({
            dimensions: dimensions,
            customBackground: new CustomBackground(dimensions)
        });

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox)
            .toBe(`${dimensions.getMinX() - 0.5} ${dimensions.getMinY() - 0.5} ${dimensions.getWidth()} ${dimensions.getHeight()}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(5);

        // Row labels

        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(5);
        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(-0.5);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(15);

        // Column labels

        expect(findGridLabels(sceneWrapper).get(2).props.x).toBe(5);
        expect(findGridLabels(sceneWrapper).get(2).props.y).toBe(0.5);
        expect(findGridLabels(sceneWrapper).get(3).props.x).toBe(15);
        expect(findGridLabels(sceneWrapper).get(3).props.y).toBe(0.5);
        expect(findGridLabels(sceneWrapper).get(4).props.x).toBe(25);
        expect(findGridLabels(sceneWrapper).get(4).props.y).toBe(0.5);

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
        [1, 2, 0, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing up'],
        [2, 3, 1, 'Scene, in Sketchpad, 17 by 9 grid. At B 3 facing upper right'],
        [1, 2, 2, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing right'],
        [1, 2, 3, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing lower right'],
        [1, 2, 4, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing down'],
        [1, 2, 5, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing lower left'],
        [1, 2, 6, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing left'],
        [1, 2, 7, 'Scene, in Sketchpad, 17 by 9 grid. At A 2 facing upper left']
    ])('x=%f, y=%f, direction=%i', (x, y, direction, expectedLabel) => {
        const sceneDimensions = new SceneDimensions(1, 17, 1, 9);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(x, y, direction, [], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
        });
        expect(findScene(sceneWrapper).get(0).props['aria-label']).toBe(expectedLabel);
    });
});

test.each([
    // Theme,    Design mode, Character, Outline, Design mode cursor
    ['default',  false,       true,      false,   false],
    ['light',    false,       true,      false,   false],
    ['dark',     false,       true,      false,   false],
    ['gray',     false,       true,      false,   false],
    ['contrast', false,       true,      true,    false],
    ['default',  true,        false,     false,   true],
    ['light',    true,        false,     false,   true],
    ['dark',     true,        false,     false,   true],
    ['gray',     true,        false,     false,   true],
    ['contrast', true,        false,     false,   true]
])('Start indicator, character, and design mode cursor (theme=%s, customBackgroundDesignMode=%p)', (theme, designMode, expectedCharacter, expectedOutline, expectedDesignModeCursor) => {
    const sceneDimensions = new SceneDimensions(1, 12, 1, 8);
    const startingX = 3;
    const startingY = 2;
    const characterX = 5;
    const characterY = 4;
    const designModeCursorX = 7;
    const designModeCursorY = 6;

    const sceneWrapper = createMountScene({
        dimensions: sceneDimensions,
        characterState: new CharacterState(
            characterX,
            characterY,
            2,
            [],
            sceneDimensions
        ),
        designModeCursorState: new DesignModeCursorState(
            designModeCursorX,
            designModeCursorY,
            sceneDimensions
        ),
        theme: theme,
        customBackground: new CustomBackground(sceneDimensions),
        customBackgroundDesignMode: designMode,
        startingX,
        startingY
    });

    // Start indicator
    const startIndicator = findStartIndicator(sceneWrapper);
    expect(startIndicator.length).toBe(1);
    expect(startIndicator.get(0).props.x)
        .toBe(startingX - startIndicator.get(0).props.width/2);
    expect(startIndicator.get(0).props.y)
        .toBe(startingY - startIndicator.get(0).props.height/2);

    // Character
    const character = findSceneCharacter(sceneWrapper);
    expect(character.exists()).toBe(expectedCharacter);
    if (expectedCharacter) {
        expect(character.get(0).props.transform)
            .toBe(`translate(${characterX} ${characterY}) rotate(0 0 0)`);
        const characterIcon = findSceneCharacterIcon(sceneWrapper);
        expect(characterIcon.hostNodes().length).toBe(1);
        const expectedCharacterDimensions = calculateCharacterDimensions();
        expect(characterIcon.get(0).props.x)
            .toBeCloseTo(expectedCharacterDimensions.x, 5);
        expect(characterIcon.get(0).props.y)
            .toBeCloseTo(expectedCharacterDimensions.y, 5);
        expect(characterIcon.get(0).props.width)
            .toBeCloseTo(expectedCharacterDimensions.width, 5);
        expect(characterIcon.get(0).props.height)
            .toBeCloseTo(expectedCharacterDimensions.height, 5);
    }

    // Character outline
    const characterOutline = findCharacterOutline(sceneWrapper);
    expect(characterOutline.exists()).toBe(expectedOutline);
    if (expectedOutline) {
        expect(characterOutline.length).toBe(1);
        expect(characterOutline.get(0).props.cx).toBe(characterX);
        expect(characterOutline.get(0).props.cy).toBe(characterY);
    }

    // Design mode cursor
    const designModeCursor = findDesignModeCursor(sceneWrapper);
    expect(designModeCursor.exists()).toBe(expectedDesignModeCursor);
    if (expectedDesignModeCursor) {
        expect(designModeCursor.length).toBe(1);
        expect(designModeCursor.get(0).props.x)
            .toBe(designModeCursorX - designModeCursor.get(0).props.width/2);
        expect(designModeCursor.get(0).props.y)
            .toBe(designModeCursorY - designModeCursor.get(0).props.height/2);
    }
});

describe('When the character renders, transform should apply', (sceneDimensions = new SceneDimensions(1, 100, 1, 100)) => {
    test('When xPos = 1, yPos = 1, direction = 2', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
        });
        const character = findSceneCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(1 1) rotate(0 0 0)');
    });
    test('When xPos = 10, yPos = 8, direction = 4', () => {
        expect.assertions(1);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(10, 8, 4, [], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
        });
        const character = findSceneCharacter(sceneWrapper);
        expect(character.get(0).props.transform)
            .toBe('translate(10 8) rotate(90 0 0) scale(1 -1)');
    });
    test('When the character is rotated and the world has enableFlipCharacter=true, rotation and/or mirroring should be applied', () => {
        expect.assertions(9);

        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
        });

        const character = findSceneCharacter(sceneWrapper);

        expect(character.get(0).props.transform).toBe('translate(1 1) rotate(0 0 0)');

        // Hard-coded to avoid having to test math with math.
        const expectedValues = [
            "translate(1 1) rotate(-90 0 0)",
            "translate(1 1) rotate(-45 0 0)",
            "translate(1 1) rotate(0 0 0)",
            "translate(1 1) rotate(45 0 0)",
            "translate(1 1) rotate(90 0 0) scale(1 -1)",
            "translate(1 1) rotate(135 0 0) scale(1 -1)",
            "translate(1 1) rotate(180 0 0) scale(1 -1)",
            "translate(1 1) rotate(225 0 0) scale(1 -1)"
        ];

        for (let direction = 0; direction <= 7; direction++) {
            sceneWrapper.setProps({characterState: new CharacterState(1, 1, direction, [], new SceneDimensions(1, 100, 1, 100))});
            const rotatedCharacter = findSceneCharacter(sceneWrapper);
            expect(rotatedCharacter.get(0).props.transform).toBe(expectedValues[direction]);
        }
    });
    test('When the character is rotated and the world has enableFlipCharacter=false, rotation should be applied without mirroring', () => {
        expect.assertions(9);

        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions),
            world: 'Landmarks',
            customBackground: new CustomBackground(sceneDimensions)
        });

        const character = findSceneCharacter(sceneWrapper);

        expect(character.get(0).props.transform).toBe('translate(1 1) rotate(0 0 0)');

        // Hard-coded to avoid having to test math with math.
        const expectedValues = [
            "translate(1 1) rotate(-90 0 0)",
            "translate(1 1) rotate(-45 0 0)",
            "translate(1 1) rotate(0 0 0)",
            "translate(1 1) rotate(45 0 0)",
            "translate(1 1) rotate(90 0 0)",
            "translate(1 1) rotate(135 0 0)",
            "translate(1 1) rotate(180 0 0)",
            "translate(1 1) rotate(225 0 0)"
        ];

        for (let direction = 0; direction <= 7; direction++) {
            sceneWrapper.setProps({characterState: new CharacterState(1, 1, direction, [], new SceneDimensions(1, 100, 1, 100))});
            const rotatedCharacter = findSceneCharacter(sceneWrapper);
            expect(rotatedCharacter.get(0).props.transform).toBe(expectedValues[direction]);
        }
    });
});

describe('When the Character has a path, it is drawn on the Scene', () => {
    test('When there is no path segment', () => {
        expect.assertions(1);
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
        });
        const characterPath = findCharacterPath(sceneWrapper);
        expect(characterPath.length).toBe(0);
    });

    test('When there is one path segment', () => {
        expect.assertions(5);
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000)
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState: new CharacterState(1, 1, 2, [{x1: 100, y1: 200, x2: 300, y2: 400}], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
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
        const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
        const sceneWrapper = createMountScene({
            dimensions: sceneDimensions,
            characterState:
                new CharacterState(1, 1, 2, [
                    {x1: 100, y1: 200, x2: 300, y2: 400},
                    {x1: 500, y1: 600, x2: 700, y2: 800}
                ], sceneDimensions),
            customBackground: new CustomBackground(sceneDimensions)
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

describe('When Scene gets scrolled', () => {
    test('Row header gets scrolled by same amount of scrollTop', () => {
        expect.assertions(2);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const rowHeader = findRowHeader(sceneWrapper);
        rowHeader.ref.currentTarget = {
            scrollTop: 0
        };
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(0);
        scene.ref.currentTarget = {
            scrollTop: 200
        };
        scene.simulate('scroll');
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(200);
    });

    test('Column header gets scrolled by same amount of scrollLeft', () => {
        expect.assertions(2);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const columnHeader = findColumnHeader(sceneWrapper);
        columnHeader.ref.currentTarget = {
            scrollLeft: 0
        };
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(0);
        scene.ref.currentTarget = {
            scrollLeft: 200
        };
        scene.simulate('scroll');
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(200);
    });

    test('Both row header and column header can be updated together', () => {
        expect.assertions(4);
        const sceneWrapper = createMountScene();
        const scene = findScene(sceneWrapper);
        const rowHeader = findRowHeader(sceneWrapper);
        const columnHeader = findColumnHeader(sceneWrapper);
        rowHeader.ref.currentTarget = {
            scrollTop: 0
        };
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(0);
        columnHeader.ref.currentTarget = {
            scrollLeft: 0
        };
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(0);
        scene.ref.currentTarget = {
            scrollTop: 200,
            scrollLeft: 200
        };
        scene.simulate('scroll');
        expect(rowHeader.ref.currentTarget.scrollTop).toBe(200);
        expect(columnHeader.ref.currentTarget.scrollLeft).toBe(200);
    });
});

describe('Scene background changes when world and theme change', () => {
    test('world property changes to DeepOcean', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'DeepOcean'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('DeepOcean-contrast.svg');
    });
    test('world property changes to Savannah', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'Savannah'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Savannah.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Savannah-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Savannah-contrast.svg');
    });
    test('world property changes to Sketchpad(default)', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene();
        const sceneBackground = findSceneBackground(sceneWrapper);
        // Renders no background
        expect(sceneBackground.get(0)).toBe(undefined);
        sceneWrapper.setProps({theme: 'gray'});
        expect(sceneBackground.get(0)).toBe(undefined);
        sceneWrapper.setProps({theme: 'contrast'});
        expect(sceneBackground.get(0)).toBe(undefined);
    });
    test('world property changes to Space', () => {
        expect.assertions(3);
        const sceneWrapper = createMountScene({world: 'Space'});
        let sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space.svg');
        sceneWrapper.setProps({theme: 'gray'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space-gray.svg');
        sceneWrapper.setProps({theme: 'contrast'});
        sceneBackground = findSceneBackground(sceneWrapper);
        expect(sceneBackground.get(0).type.render().props.children).toBe('Space-contrast.svg');
    });
});
