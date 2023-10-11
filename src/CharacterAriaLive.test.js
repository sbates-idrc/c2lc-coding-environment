// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';
import type { RunningState } from './types';
import messages from './messages.json';

configure({ adapter: new Adapter()});

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
    runningState: 'stopped',
    world: 'Sketchpad',
    customBackground: emptyCustomBackground,
    customBackgroundEditMode: false,
    characterDescriptionBuilder: new CharacterDescriptionBuilder(intl)
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

function getLiveRegionInnerText() {
    return ((document.getElementById('someAriaLiveRegionId'): any): HTMLElement).innerText;
}

function getLiveRegionAriaHidden() {
    return ((document.getElementById('someAriaLiveRegionId'): any): HTMLElement).getAttribute('aria-hidden');
}

test('The live region is updated when the characterState prop is changed', () => {
    const wrapper = createMountCharacterAriaLive();
    expect(getLiveRegionInnerText()).toBeUndefined();
    wrapper.setProps({
        characterState: new CharacterState(1, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionInnerText()).toBe('At A 1 facing right');
    wrapper.setProps({
        characterState: new CharacterState(3, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionInnerText()).toBe('At C 1 facing right');
});

type RunningStateTestCase = {
    runningStateBefore: RunningState,
    runningStateAfter: RunningState,
    expectedLiveRegion: string
};

test.each(([
    {
        runningStateBefore: 'running',
        runningStateAfter: 'pauseRequested',
        expectedLiveRegion: 'At A 1 facing right'
    },
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
        runningStateBefore: 'stopped',
        runningStateAfter: 'running',
        expectedLiveRegion: 'the robot is moving'
    }
]: Array<RunningStateTestCase>))('The live region is updated when the runningState is changed', (testData: RunningStateTestCase) => {

    const wrapper = createMountCharacterAriaLive({
        runningState: testData.runningStateBefore
    });
    expect(getLiveRegionInnerText()).toBeUndefined();
    wrapper.setProps({
        runningState: testData.runningStateAfter
    });
    expect(getLiveRegionInnerText()).toBe(testData.expectedLiveRegion);
});

test('The live region is updated when the world prop is changed', () => {
    const wrapper = createMountCharacterAriaLive();
    expect(getLiveRegionInnerText()).toBeUndefined();
    wrapper.setProps({
        world: 'Savannah'
    });
    expect(getLiveRegionInnerText()).toBe('At A 1 facing right');
    wrapper.setProps({
        world: 'Space'
    });
    expect(getLiveRegionInnerText()).toBe('At A 1 on the Earth facing right');
});

test('Custom background edit mode', () => {
    const wrapper = createMountCharacterAriaLive({
        customBackgroundEditMode: true
    });
    wrapper.setProps({
        characterState: new CharacterState(3, 1, 2, [], sceneDimensions)
    });
    expect(getLiveRegionInnerText()).toBe('At C 1');
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
