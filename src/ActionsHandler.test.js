// @flow

import ActionsHandler from './ActionsHandler';
import type { ActionResult } from './ActionsHandler';
import { App } from './App';
import AudioManagerImpl from './AudioManagerImpl';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import { createIntl } from 'react-intl';
import SceneDimensions from './SceneDimensions';
import type { BlockName } from './types';

import messages from './messages.json';

jest.mock('./App');
jest.mock('./AudioManagerImpl');

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);

// A wall at E1
const customBackground = new CustomBackground(sceneDimensions,
    ['0', '0', '0', '0', '1']);

function createActionsHandler() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    AudioManagerImpl.mockClear();

    // $FlowFixMe: Jest mock API
    const actionsHandler = new ActionsHandler(new App(), new AudioManagerImpl(), sceneDimensions, intl);

    // $FlowFixMe: Jest mock API
    const appMock = App.mock.instances[0];
    // $FlowFixMe: Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    return {
        actionsHandler,
        appMock,
        audioManagerMock
    };
}

type MovementTestCase = {|
    action: BlockName,
    x: number,
    y: number,
    direction: number,
    expectedX: number,
    expectedY: number,
    expectedDirection: number,
    expectedMessage: ?string,
    expectedActionResult: ActionResult
|};

test.each(([
    {
        action: 'forward1',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 2,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'forward2',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 3,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'forward3',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 4,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'backward1',
        x: 4,
        y: 1,
        direction: 2,
        expectedX: 3,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'backward2',
        x: 4,
        y: 1,
        direction: 2,
        expectedX: 2,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'backward3',
        x: 4,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'left45',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 1,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'left90',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 0,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'left180',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 6,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'right45',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 3,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'right90',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 4,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        action: 'right180',
        x: 1,
        y: 1,
        direction: 2,
        expectedX: 1,
        expectedY: 1,
        expectedDirection: 6,
        expectedMessage: undefined,
        expectedActionResult: 'success'
    },
    {
        // Bump into a wall, going forward
        action: 'forward1',
        x: 4,
        y: 1,
        direction: 2,
        expectedX: 4,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: 'Your character hit a wall on E1. Program is paused.',
        expectedActionResult: 'movementBlocked'
    },
    {
        // Bump into a wall, going backward
        action: 'backward1',
        x: 6,
        y: 1,
        direction: 2,
        expectedX: 6,
        expectedY: 1,
        expectedDirection: 2,
        expectedMessage: 'Your character hit a wall on E1. Program is paused.',
        expectedActionResult: 'movementBlocked'
    }
]: Array<MovementTestCase>))('doAction', (testData: MovementTestCase, done) => {
    expect.assertions(9);

    const { actionsHandler, appMock, audioManagerMock } = createActionsHandler();

    appMock.setState.mockImplementation((updater) => {
        const newState = updater({
            characterState: new CharacterState(
                testData.x,
                testData.y,
                testData.direction,
                [],
                sceneDimensions
            ),
            drawingEnabled: true,
            customBackground: customBackground
        });

        expect(audioManagerMock.playSoundForCharacterState.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSoundForCharacterState.mock.calls[0][0]).toBe(testData.action);
        expect(audioManagerMock.playSoundForCharacterState.mock.calls[0][2]).toBe(newState.characterState);
        expect(audioManagerMock.playSoundForCharacterState.mock.calls[0][3]).toBe(sceneDimensions);

        expect(newState.characterState.xPos).toBe(testData.expectedX);
        expect(newState.characterState.yPos).toBe(testData.expectedY);
        expect(newState.characterState.direction).toBe(testData.expectedDirection);
        expect(newState.message).toBe(testData.expectedMessage);
    });

    actionsHandler.doAction(testData.action, 0).then((result) => {
        expect(result).toBe(testData.expectedActionResult);
        done();
    });
});
