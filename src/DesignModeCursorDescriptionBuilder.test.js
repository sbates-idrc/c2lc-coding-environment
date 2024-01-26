// @flow

import CustomBackground from './CustomBackground';
import DesignModeCursorDescriptionBuilder from './DesignModeCursorDescriptionBuilder';
import messages from './messages.json';
import PositionState from './PositionState';
import { createIntl } from 'react-intl';
import SceneDimensions from './SceneDimensions';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);
const emptyCustomBackground = new CustomBackground(sceneDimensions);

test('Space, background description: no, custom background tile: no', () => {
    const builder = new DesignModeCursorDescriptionBuilder(intl);
    expect(builder.buildDescription(
        new PositionState(3, 2, sceneDimensions),
        'Space',
        emptyCustomBackground
    )).toBe('At C 2');
});

test('Space, background description: no, custom background tile: yes', () => {
    const builder = new DesignModeCursorDescriptionBuilder(intl);
    expect(builder.buildDescription(
        new PositionState(3, 2, sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '0', '1'
        ])
    )).toBe('At C 2 on wall');
});

test('Space, background description: yes, custom background tile: no', () => {
    const builder = new DesignModeCursorDescriptionBuilder(intl);
    expect(builder.buildDescription(
        new PositionState(3, 1, sceneDimensions),
        'Space',
        emptyCustomBackground
    )).toBe('At C 1 on the Moon');
});

test('Space, background description: yes, custom background tile: yes', () => {
    const builder = new DesignModeCursorDescriptionBuilder(intl);
    expect(builder.buildDescription(
        new PositionState(3, 1, sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '1'
        ])
    )).toBe('At C 1 on wall');
});
