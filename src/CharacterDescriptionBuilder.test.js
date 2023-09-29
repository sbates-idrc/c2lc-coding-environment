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
    const builder = new CharacterDescriptionBuilder(intl);

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 0, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing up');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 1, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing upper right');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 2, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing right');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 3, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing lower right');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 4, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing down');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 5, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing lower left');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 6, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing left');

    expect(builder.buildCharacterDescription(
        new CharacterState(1, 1, 7, [], sceneDimensions),
        'Sketchpad',
        emptyCustomBackground,
        false
    )).toBe('the robot is at column A, row 1 facing upper left');
});

test('Space, edit mode: no, background description: no, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        false
    )).toBe('the spaceship is at column C, row 2 facing right');
});

test('Space, edit mode: no, background description: no, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '0', '1'
        ]),
        false
    )).toBe('the spaceship is at column C, row 2 facing right on wall');
});

test('Space, edit mode: no, background description: yes, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        false
    )).toBe('the spaceship is at column C, row 1 facing right on the Moon');
});

test('Space, edit mode: no, background description: yes, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '1'
        ]),
        false
    )).toBe('the spaceship is at column C, row 1 facing right on wall');
});

test('Space, edit mode: yes, background description: no, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        true
    )).toBe('the paintbrush is at column C, row 2');
});

test('Space, edit mode: yes, background description: no, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 2, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            '0', '0', '1'
        ]),
        true
    )).toBe('the paintbrush is at column C, row 2 on wall');
});

test('Space, edit mode: yes, background description: yes, custom background tile: no', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        emptyCustomBackground,
        true
    )).toBe('the paintbrush is at column C, row 1 on the Moon');
});

test('Space, edit mode: yes, background description: yes, custom background tile: yes', () => {
    const builder = new CharacterDescriptionBuilder(intl);
    expect(builder.buildCharacterDescription(
        new CharacterState(3, 1, 2, [], sceneDimensions),
        'Space',
        new CustomBackground(sceneDimensions, [
            '0', '0', '1'
        ]),
        true
    )).toBe('the paintbrush is at column C, row 1 on wall');
});
