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

test('Hit wall message', () => {
    const builder = new CharacterMessageBuilder(sceneDimensions, intl);
    expect(builder.buildHitWallMessage(3, 2)).toBe('Your character hit a wall on C2');
});
