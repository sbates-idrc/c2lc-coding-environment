// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import DesignModeCursorDescriptionBuilder from './DesignModeCursorDescriptionBuilder';
import PositionState from './PositionState';
import SceneDimensions from './SceneDimensions';
import type { RunningState } from './types';
import messages from './messages.json';

configure({ adapter: new Adapter() });

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

beforeEach(() => {
    const liveRegionDiv = document.createElement('div');
    liveRegionDiv.setAttribute('id', 'someAriaLiveRegionId');
    ((document.body: any): HTMLBodyElement).appendChild(liveRegionDiv);
});

afterEach(() => {
    const liveRegionDiv = ((document.getElementById('someAriaLiveRegionId'): any): HTMLElement);
    ((liveRegionDiv.parentNode: any): Node).removeChild(liveRegionDiv);
});

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);
const emptyCustomBackground = new CustomBackground(sceneDimensions);

const defaultCharacterAriaLiveProps = {
    ariaLiveRegionId: 'someAriaLiveRegionId',
    ariaHidden: false,
    characterState: new CharacterState(1, 1, 2, [], sceneDimensions),
    designModeCursorState: new PositionState(1, 1, sceneDimensions),
    runningState: 'stopped',
    world: 'Sketchpad',
    customBackground: emptyCustomBackground,
    customBackgroundDesignMode: false,
    characterDescriptionBuilder: new CharacterDescriptionBuilder(intl),
    designModeCursorDescriptionBuilder: new DesignModeCursorDescriptionBuilder(intl),
    message: null
};

function createMountCharacterAriaLive(props) {
    const wrapper = mount(
        React.createElement(
            CharacterAriaLive,
            Object.assign(
                {},
                defaultCharacterAriaLiveProps,
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

function getLiveRegionText() {
    return ((document.getElementById('someAriaLiveRegionId'): any): HTMLElement).textContent;
}

function getLiveRegionAriaHidden() {
    return ((document.getElementById('someAriaLiveRegionId'): any): HTMLElement).getAttribute('aria-hidden');
}

test('The live region is updated when the characterState prop is changed', () => {
    const wrapper = createMountCharacterAriaLive();
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        characterState: new CharacterState(1, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionText()).toBe('At A 1 facing right');
    wrapper.setProps({
        characterState: new CharacterState(3, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionText()).toBe('At C 1 facing right');
});

test('The live region is updated with the design mode cursor prop is changed', () => {
    const wrapper = createMountCharacterAriaLive({
        customBackgroundDesignMode: true
    });
    wrapper.setProps({
        designModeCursorState: new PositionState(3, 1, sceneDimensions)
    });
    expect(getLiveRegionText()).toBe('At C 1');
});

type RunningStateTestCase = {
    runningStateBefore: RunningState,
    runningStateAfter: RunningState,
    expectedLiveRegion: string
};

test.each(([
    {
        runningStateBefore: 'running',
        runningStateAfter: 'stopRequested',
        expectedLiveRegion: 'At A 1 facing right'
    },
    {
        runningStateBefore: 'running',
        runningStateAfter: 'stopped',
        expectedLiveRegion: 'At A 1 facing right'
    },
    {
        runningStateBefore: 'running',
        runningStateAfter: 'pauseRequested',
        expectedLiveRegion: 'At A 1 facing right'
    },
    {
        runningStateBefore: 'running',
        runningStateAfter: 'paused',
        expectedLiveRegion: 'At A 1 facing right'
    },
    {
        runningStateBefore: 'stopped',
        runningStateAfter: 'running',
        expectedLiveRegion: 'the robot is moving'
    }
]: Array<RunningStateTestCase>))('The live region is updated when the runningState is changed', (testData: RunningStateTestCase) => {

    const wrapper = createMountCharacterAriaLive({
        runningState: testData.runningStateBefore
    });
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        runningState: testData.runningStateAfter
    });
    expect(getLiveRegionText()).toBe(testData.expectedLiveRegion);
});

test('When a message is included in the props change, it is included in the live region update', () => {
    const wrapper = createMountCharacterAriaLive({
        runningState: 'running'
    });
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        message: 'Example message.',
        runningState: 'paused'
    });
    expect(getLiveRegionText()).toBe('Example message. At A 1 facing right');
});

test('When a message is in a previous props change, it is included in the live region update', () => {
    const wrapper = createMountCharacterAriaLive({
        runningState: 'running'
    });
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        message: 'Example message.'
    });
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        runningState: 'paused'
    });
    expect(getLiveRegionText()).toBe('Example message. At A 1 facing right');
});

test('A message is only added to the live region once', () => {
    const wrapper = createMountCharacterAriaLive({
        runningState: 'running'
    });
    wrapper.setProps({
        message: 'Example message.'
    });
    wrapper.setProps({
        runningState: 'paused'
    });
    expect(getLiveRegionText()).toBe('Example message. At A 1 facing right');
    wrapper.setProps({
        characterState: new CharacterState(2, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionText()).toBe('At B 1 facing right');
});

test('If a message is set, then set to null, then set to the same text again, it is included the 2nd time', () => {
    const wrapper = createMountCharacterAriaLive({
        runningState: 'running'
    });
    wrapper.setProps({
        message: 'Example message.'
    });
    wrapper.setProps({
        runningState: 'paused'
    });
    expect(getLiveRegionText()).toBe('Example message. At A 1 facing right');
    wrapper.setProps({
        message: null
    });
    wrapper.setProps({
        message: 'Example message.'
    });
    wrapper.setProps({
        characterState: new CharacterState(2, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionText()).toBe('Example message. At B 1 facing right');
});

test('The live region is updated with the character description when design mode is exited', () => {
    const wrapper = createMountCharacterAriaLive({
        customBackgroundDesignMode: true
    });
    expect(getLiveRegionText()).toBe('');
    wrapper.setProps({
        customBackgroundDesignMode: false
    });
    expect(getLiveRegionText()).toBe('At A 1 facing right');
});

describe('The live region is updated when the world prop is changed', () => {
    test('Character description in default mode', () => {
        const wrapper = createMountCharacterAriaLive();
        expect(getLiveRegionText()).toBe('');
        wrapper.setProps({
            world: 'Savannah'
        });
        expect(getLiveRegionText()).toBe('At A 1 facing right');
        wrapper.setProps({
            world: 'Space'
        });
        expect(getLiveRegionText()).toBe('At A 1 on the Earth facing right');
    });
    test('Design mode cursor description in design mode', () => {
        const wrapper = createMountCharacterAriaLive({
            customBackgroundDesignMode: true
        });
        expect(getLiveRegionText()).toBe('');
        wrapper.setProps({
            world: 'Savannah'
        });
        expect(getLiveRegionText()).toBe('At A 1');
        wrapper.setProps({
            world: 'Space'
        });
        expect(getLiveRegionText()).toBe('At A 1 on the Earth');
    });
});

test('The live region has aria-hidden false when the ariaHidden prop is false', () => {
    expect.assertions(1);
    createMountCharacterAriaLive({
        ariaHidden: false
    });
    expect(getLiveRegionAriaHidden()).toBe('false');
});

test('The live region has aria-hidden true when the ariaHidden prop is true', () => {
    expect.assertions(1);
    createMountCharacterAriaLive({
        ariaHidden: true
    });
    expect(getLiveRegionAriaHidden()).toBe('true');
});

test('The live region is updated when the ariaHidden prop is changed', () => {
    expect.assertions(3);
    const wrapper = createMountCharacterAriaLive({
        ariaHidden: false
    });
    expect(getLiveRegionAriaHidden()).toBe('false');
    wrapper.setProps({ ariaHidden: true });
    expect(getLiveRegionAriaHidden()).toBe('true');
    wrapper.setProps({ ariaHidden: false });
    expect(getLiveRegionAriaHidden()).toBe('false');
});
