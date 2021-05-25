// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const defaultCharacterAriaLiveProps = {
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(100, 100)),
    runningState: 'stopped',
    world: 'default'
};

function createMountCharacterAriaLive(props) {
    const ariaLiveDiv = document.createElement('div');
    ariaLiveDiv.setAttribute('id', 'character-position');
    // $FlowFixMe: Flow doesn't know about document.body
    document.body.appendChild(ariaLiveDiv);

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


describe('Character position gets updated on character-position div', () => {
    test('When characterState prop is changed', () => {
        const wrapper = createMountCharacterAriaLive();
        wrapper.setProps({
            characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(100,100))
        });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('character-position').innerText).toBe('Robot character at column A, row 1 facing right');
        wrapper.setProps({world: 'forest', characterState: new CharacterState(2, 1, 2, [], new SceneDimensions(100, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('character-position').innerText).toBe('Rabbit character at column B, row 1 facing right');
        wrapper.setProps({world: 'space', characterState: new CharacterState(3, 1, 2, [], new SceneDimensions(100, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('character-position').innerText).toBe('Space Ship character at column C, row 1 facing right');
    })
});
