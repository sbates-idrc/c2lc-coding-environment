// @flow

import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import messages from './messages.json';
import { createIntl } from 'react-intl';
import SceneDimensions from './SceneDimensions';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);
const emptyCustomBackground = new CustomBackground(sceneDimensions);

test('All 8 directions', () => {
    const builder = new CharacterDescriptionBuilder();

    expect(builder.buildDescription(
        new CharacterState(1, 1, 0, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing up');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 1, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing upper right');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 2, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing right');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 3, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing lower right');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 4, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing down');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 5, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing lower left');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 6, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing left');

    expect(builder.buildDescription(
        new CharacterState(1, 1, 7, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        intl
    )).toBe('At A 1 facing upper left');
});

test('Space, background description: no, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder();
    expect(builder.buildDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        intl
    )).toBe('At C 2 facing right');
});

test('Space, background description: no, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder();
    expect(builder.buildDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '0', '1'
        ]),
        intl
    )).toBe('At C 2 on wall facing right');
});

test('Space, background description: yes, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder();
    expect(builder.buildDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        intl
    )).toBe('At C 1 on the Moon facing right');
});

test('Space, background description: yes, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder();
    expect(builder.buildDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '1'
        ]),
        intl
    )).toBe('At C 1 on wall facing right');
});
