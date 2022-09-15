// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Character from './Character';

configure({ adapter: new Adapter() });

const defaultCharacterProps = {
    world: 'Sketchpad',
    theme: 'light',
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

describe('Right character should render based on world and theme props', () => {
    test('DeepOcean', () => {
        expect.assertions(3);
        const wrapper = createMountCharacter({world: 'DeepOcean'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine-contrast.svg');
    });
    test('Savannah', () => {
        expect.assertions(3);
        const wrapper = createMountCharacter({world: 'Savannah'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-contrast.svg');
    });
    test('Sketchpad', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter();
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('Space', () => {
        expect.assertions(3);
        const wrapper = createMountCharacter({world: 'Space'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip-contrast.svg');
    });
})
