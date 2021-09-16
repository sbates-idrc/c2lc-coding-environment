// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Character from './Character';

configure({ adapter: new Adapter() });

const defaultCharacterProps = {
    world: 'Sketchpad',
    transform: '',
    width: 3
};

function createMountCharacter(props) {
    const wrapper = mount(
        React.createElement(
            Character,
            Object.assign(
                {},
                defaultCharacterProps,
                props
            )
        )
    );

    return wrapper;
}

function findCharacter(wrapper) {
    return wrapper.find('.Character__icon');
}

describe('Right character should render based on theme props', () => {
    test('Sketchpad', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter();
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('Jungle', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter({world: 'Jungle'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Rabbit.svg');
    });
    test('Space', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter({world: 'Space'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
    });
})
