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
    return playButtonWrapper.find(AriaDisablingButton)
        .filter('.PlayButton');
}

describe('The Play button class is changed when the program is running', () => {
    describe('Given the program is running', () => {
        test('Then the Play button should have the pressed class', () => {
            expect.assertions(1);
            const wrapper = createShallowPlayButton({
                interpreterIsRunning: true
            });
            expect(getPlayButton(wrapper).hasClass('PlayButton--pressed')).toBe(true);
        })
    });

    describe('Given the program is not running', () => {
        test('Then the Play button should not have the pressed class', () => {
            expect.assertions(1);
            const wrapper = createShallowPlayButton({
                interpreterIsRunning: false
            });
            expect(getPlayButton(wrapper).hasClass('PlayButton--pressed')).toBe(false);
        })
    });
});

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
