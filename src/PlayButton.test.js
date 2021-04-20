// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';
import AriaDisablingButton from './AriaDisablingButton';
import PlayButton from './PlayButton';

configure({ adapter: new Adapter()});

const defaultPlayButtonProps = {
    interpreterIsRunning: false,
    disabled: false
};

function createShallowPlayButton(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const wrapper = shallow(
        React.createElement(
            PlayButton.WrappedComponent,
            Object.assign(
                {},
                defaultPlayButtonProps,
                {
                    intl: intl
                },
                props
            )
        )
    );

    return wrapper;
}

function getPlayButton(playButtonWrapper) {
    return playButtonWrapper.find(AriaDisablingButton);
}

describe('The Play button renders different svgs', () => {
    test('Renders play svg when interpreterIsRunning property is false', () => {
        const wrapper = createShallowPlayButton({
            interpreterIsRunning: false
        });
        expect(getPlayButton(wrapper).get(0).props['aria-label']).toBe('Play');
        expect(getPlayButton(wrapper).get(0).props.children.type.render().props.children).toBe('Play.svg');
    });

    test('Renders pause svg when interpreterIsRunning property is true', () => {
        const wrapper = createShallowPlayButton({
            interpreterIsRunning: true
        });
        expect(getPlayButton(wrapper).get(0).props['aria-label']).toBe('Pause');
        expect(getPlayButton(wrapper).get(0).props.children.type.render().props.children).toBe('Pause.svg');
    });
})

describe('The Play button can be disabled', () => {
    describe('Given disabled is true', () => {
        test('Then the Play button should be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowPlayButton({
                disabled: true
            });
            expect(getPlayButton(wrapper).props().disabled).toBe(true);
        })
    });

    describe('Given disabled is false', () => {
        test('Then the Play button should not be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowPlayButton({
                disabled: false
            });
            expect(getPlayButton(wrapper).props().disabled).toBe(false);
        })
    });
});
