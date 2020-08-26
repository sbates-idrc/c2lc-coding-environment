// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import Scene from './Scene';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';

configure({ adapter: new Adapter()});

const defaultSceneProps = {
    numRows: 1,
    numColumns: 1,
    gridCellWidth: 10
};

const characterState = new CharacterState(0, 0, 90);

function createMountScene(props) {
    const wrapper = mount(
        React.createElement(
            Scene,
            Object.assign(
                {},
                defaultSceneProps,
                {
                    characterState
                },
                props
            )
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

function findRobotCharacter(sceneWrapper) {
    return sceneWrapper.find('.RobotCharacter');
}

function findRobotCharacterIcon(sceneWrapper) {
    return sceneWrapper.find('.RobotCharacter__icon');
}

function getGridDimensions(numRows, numColumns, gridCellWidth) {
    const width = numColumns * gridCellWidth;
    const height = numRows * gridCellWidth;
    const minX = -width / 2;
    const minY = -height / 2;
    return { width, height, minX, minY };
}

function getCharacterDimensions(gridCellWidth) {
    const characterWidth = gridCellWidth * 0.8 * 0.75;
    const x = -characterWidth/2;
    const y = -characterWidth/2;
    const width = characterWidth;
    const height = characterWidth;
    return { x, y, width, height };
}

describe('When the Scene renders', () => {
    test('With numRows = 0, numColumns = 2, gridCellWidth = 5', () => {
        expect.assertions(1);
        const numRows = 0;
        const numColumns = 2;
        const gridCellWidth = 5;
        const sceneWrapper = createMountScene({numRows, numColumns, gridCellWidth});
        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With numRows = 2, numColumns = 0, gridCellWidth = 10', () => {
        expect.assertions(1);
        const numRows = 2;
        const numColumns = 0;
        const gridCellWidth = 10;
        const sceneWrapper = createMountScene({numRows, numColumns, gridCellWidth});
        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With numRows = 1, numColumns = 1, gridCellWidth = 4', () => {
        expect.assertions(7);
        const numRows = 1;
        const numColumns = 1;
        const gridCellWidth = 4;
        const gridDimensions = getGridDimensions(numRows, numColumns, gridCellWidth);
        const sceneWrapper = createMountScene({numRows, numColumns, gridCellWidth});

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox).toBe(`${gridDimensions.minX} ${gridDimensions.minY} ${gridDimensions.width} ${gridDimensions.height}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(2);
        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(gridDimensions.minX - gridDimensions.width * 0.025);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(gridDimensions.minY + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(gridDimensions.minX + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(gridDimensions.minY - gridDimensions.width * 0.025);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(0);
    });

    test('With numRows = 2, numColumns = 2, gridCellWidth = 6', () => {
        expect.assertions(19);
        const numRows = 2;
        const numColumns = 2;
        const gridCellWidth = 6;
        const gridDimensions = getGridDimensions(numRows, numColumns, gridCellWidth);
        const sceneWrapper = createMountScene({numRows, numColumns, gridCellWidth});

        // Scene viewbox

        expect(findScene(sceneWrapper).get(0).props.children.props.viewBox).toBe(`${gridDimensions.minX} ${gridDimensions.minY} ${gridDimensions.width} ${gridDimensions.height}`);

        // Grid labels

        expect(findGridLabels(sceneWrapper).length).toBe(4);
        expect(findGridLabels(sceneWrapper).get(0).props.x).toBe(gridDimensions.minX - gridDimensions.width * 0.025);
        expect(findGridLabels(sceneWrapper).get(0).props.y).toBe(gridDimensions.minY + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(1).props.x).toBe(gridDimensions.minX - gridDimensions.width * 0.025);
        expect(findGridLabels(sceneWrapper).get(1).props.y).toBe(gridDimensions.minY + gridCellWidth + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(2).props.x).toBe(gridDimensions.minX + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(2).props.y).toBe(gridDimensions.minY - gridDimensions.width * 0.025);
        expect(findGridLabels(sceneWrapper).get(3).props.x).toBe(gridDimensions.minX + gridCellWidth + gridCellWidth - gridCellWidth / 2);
        expect(findGridLabels(sceneWrapper).get(3).props.y).toBe(gridDimensions.minY - gridDimensions.width * 0.025);

        // Grid lines

        expect(findGridLines(sceneWrapper).length).toBe(2);
        expect(findGridLines(sceneWrapper).get(0).props.x1).toBe(gridDimensions.minX);
        expect(findGridLines(sceneWrapper).get(0).props.y1).toBe(gridDimensions.minY + gridCellWidth);
        expect(findGridLines(sceneWrapper).get(0).props.x2).toBe(gridDimensions.minX + gridCellWidth * numColumns);
        expect(findGridLines(sceneWrapper).get(0).props.y2).toBe(gridDimensions.minY + gridCellWidth);

        expect(findGridLines(sceneWrapper).get(1).props.x1).toBe(gridDimensions.minX + gridCellWidth);
        expect(findGridLines(sceneWrapper).get(1).props.y1).toBe(gridDimensions.minY);
        expect(findGridLines(sceneWrapper).get(1).props.x2).toBe(gridDimensions.minX + gridCellWidth);
        expect(findGridLines(sceneWrapper).get(1).props.y2).toBe(gridDimensions.minY + gridCellWidth * numRows);
    })
});

describe('When the Scene renders', () => {
    test('Should render the robot character component', () => {
        expect.assertions(5);
        const gridCellWidth = 5;
        const sceneWrapper = createMountScene({gridCellWidth});
        const characterDimensions = getCharacterDimensions(gridCellWidth);
        expect(findRobotCharacterIcon(sceneWrapper).hostNodes().length).toBe(1);
        expect(findRobotCharacterIcon(sceneWrapper).get(0).props.x).toBe(characterDimensions.x);
        expect(findRobotCharacterIcon(sceneWrapper).get(0).props.y).toBe(characterDimensions.y);
        expect(findRobotCharacterIcon(sceneWrapper).get(0).props.width).toBe(characterDimensions.width);
        expect(findRobotCharacterIcon(sceneWrapper).get(0).props.height).toBe(characterDimensions.height);
    });
});

describe('When the robot character renders, transform should apply', () => {
    test('When xPos = 0, yPos = 0, directionDegrees = 90', () => {
        expect.assertions(1);
        const directionDegrees = 90;
        const sceneWrapper = createMountScene({characterState: new CharacterState(0, 0, directionDegrees)});
        const robotCharacter = findRobotCharacter(sceneWrapper);
        expect(robotCharacter.get(0).props.transform).toBe(`translate(0 0) rotate(${directionDegrees - 90} 0 0)`);
    });
    test('When xPos = 100, yPos = 80, directionDegrees = 180', () => {
        expect.assertions(1);
        const directionDegrees = 180;
        const sceneWrapper = createMountScene({characterState: new CharacterState(100, 80, directionDegrees)});
        const robotCharacter = findRobotCharacter(sceneWrapper);
        expect(robotCharacter.get(0).props.transform).toBe(`translate(100 80) rotate(${directionDegrees - 90} 0 0)`);
    });
    test('When xPos = 0, yPos = 90, directionDegrees = -90', () => {
        expect.assertions(1);
        const directionDegrees = -90;
        const sceneWrapper = createMountScene({characterState: new CharacterState(0, 90, directionDegrees)});
        const robotCharacter = findRobotCharacter(sceneWrapper);
        expect(robotCharacter.get(0).props.transform).toBe(`translate(0 90) rotate(${directionDegrees - 90} 0 0)`);
    })
})

