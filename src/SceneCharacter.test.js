// @flow

import CharacterState from './CharacterState';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import SceneCharacter from './SceneCharacter';
import SceneDimensions from './SceneDimensions';

configure({ adapter: new Adapter() });

const sceneDimensions = new SceneDimensions(1, 12, 1, 8);
const characterState = new CharacterState(1, 1, 2, [], sceneDimensions);

const defaultSceneCharacterProps = {
    characterState: characterState,
    theme: 'light',
    world: 'Sketchpad'
};

function createMountSceneCharacter(props) {
    const wrapper = mount(
        React.createElement(
            SceneCharacter,
            Object.assign(
                {},
                defaultSceneCharacterProps,
                props
            )
        )
    );

    return wrapper;
}

function findSceneCharacter(wrapper) {
    return wrapper.find('.SceneCharacter__icon');
}

describe('Right character should render based on world and theme props', () => {
    test('DeepOcean', () => {
        expect.assertions(3);
        const wrapper = createMountSceneCharacter({world: 'DeepOcean'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('Submarine-contrast.svg');
    });
    test('Savannah', () => {
        expect.assertions(3);
        const wrapper = createMountSceneCharacter({world: 'Savannah'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-contrast.svg');
    });
    test('Sketchpad', () => {
        expect.assertions(1);
        const wrapper = createMountSceneCharacter();
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('Space', () => {
        expect.assertions(3);
        const wrapper = createMountSceneCharacter({world: 'Space'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
        wrapper.setProps({theme: 'gray'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip-gray.svg');
        wrapper.setProps({theme: 'contrast'});
        expect(findSceneCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip-contrast.svg');
    });
})
