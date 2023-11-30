// @flow

import CharacterMessageBuilder from './CharacterMessageBuilder';
import messages from './messages.json';
import { createIntl } from 'react-intl';
import SceneDimensions from './SceneDimensions';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);

test('End of scene', () => {
    const builder = new CharacterMessageBuilder(sceneDimensions, intl);
    const message = builder.buildMessage({
        type: 'endOfScene',
        x: 1,
        y: 1
    });
    expect(message).toBe('Your character has reached the end of the scene. Program is paused.');
});

test('Hit wall', () => {
    const builder = new CharacterMessageBuilder(sceneDimensions, intl);
    const message = builder.buildMessage({
        type: 'hitWall',
        x: 3,
        y: 2
    });
    expect(message).toBe('Your character hit a wall on C2. Program is paused.');
});
