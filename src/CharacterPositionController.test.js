// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow, ReactWrapper } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';
import CharacterPositionController from './CharacterPositionController';
import * as TestUtils from './TestUtils';

configure({ adapter: new Adapter()});

const characterEnableFlipClassName = 'CharacterPositionController__character-column-character--enable-flip';

type ButtonName = 'turnLeft' | 'turnRight' | 'up' | 'right' | 'down' | 'left';

const defaultCharacterPositionControllerProps = {
    interpreterIsRunning: false,
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100)),
    editingDisabled: false,
    theme: 'light',
    world: 'Sketchpad',
    customBackgroundEditMode: false,
    selectedCustomBackgroundTile: null
};

function createShallowCharacterPositionController(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();
    const mockClickPaintbrushButton = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            CharacterPositionController.WrappedComponent,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    intl: intl,
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition,
                    onClickPaintbrushButton: mockClickPaintbrushButton
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockChangeCharacterPosition,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
        mockClickPaintbrushButton
    };
}

function createMountCharacterPositionController(props) {
    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();
    const mockClickPaintbrushButton = jest.fn();

    const wrapper = mount(
        React.createElement(
            CharacterPositionController,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition,
                    onClickPaintbrushButton: mockClickPaintbrushButton
                },
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

    return {
        wrapper,
        mockChangeCharacterPosition,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
        mockClickPaintbrushButton
    };
}

function getCharacterPositionButton(wrapper: ReactWrapper<HTMLElement>,
    buttonName: ButtonName): ReactWrapper<HTMLElement> {

    return wrapper
        .find('.CharacterPositionController__character-position-button')
        .filter({value: buttonName})
        .at(0);
}

function getCharacterPositionCoordinateBoxes(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.ProgramBlock__character-position-coordinate-box');
}

function getCharacterIcon(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.CharacterPositionController__character-column-character');
}

function getPaintbrushButton(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.CharacterPositionController__paintbrushButton');
}

describe('Using change character position buttons', () => {
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button ', (buttonName) => {
        expect.assertions(4);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController();
        const characterPositionButton = getCharacterPositionButton(wrapper, buttonName);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterPosition.mock.calls[0][0]).toBe(buttonName);

        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterPosition.mock.calls[1][0]).toBe(buttonName);
    });
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button when editingDisabled Prop is true', (buttonName) => {
        expect.assertions(3);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController({editingDisabled: true});
        const characterPositionButton = getCharacterPositionButton(wrapper, buttonName);
        expect(characterPositionButton.get(0).props.className.includes('--disabled')).toBe(true);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
    });
});

describe('Using change character position by column/row labels', () => {
    test('Changing x position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterXPosition } = createShallowCharacterPositionController();
        const characterXPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(0);
        const sampleXPosition = 'X';
        const secondSampleXPosition = 'A';
        const currentTarget = (value: string) => ({
            name: 'xPosition',
            value
        });

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(sampleXPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(currentTarget(sampleXPosition)));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleXPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(secondSampleXPosition);

        characterXPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleXPosition), 'Enter'));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterXPosition.mock.calls[1][0]).toBe(secondSampleXPosition);
    });
    test('Changing y position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterYPosition } = createShallowCharacterPositionController();
        const characterYPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(1);
        const sampleYPosition = '2';
        const secondSampleYPosition = '8';
        const currentTarget = (value: string) => ({
            name: 'yPosition',
            value
        });

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(sampleYPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(currentTarget(sampleYPosition)));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleYPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(secondSampleYPosition);

        characterYPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleYPosition), 'Enter'));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterYPosition.mock.calls[1][0]).toBe(secondSampleYPosition);
    });
});

test('Changing world changes the character icon', () => {
    expect.assertions(9);
    const { wrapper } = createShallowCharacterPositionController();
    // DeepOcean World
    wrapper.setProps({world: 'DeepOcean', theme: 'light'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('Submarine.svg');
    wrapper.setProps({theme: 'gray'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('Submarine-gray.svg');
    wrapper.setProps({theme: 'contrast'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('Submarine-contrast.svg');
    // Savannah World
    wrapper.setProps({world: 'Savannah', theme: 'light'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SavannahJeep.svg');
    wrapper.setProps({theme: 'gray'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-gray.svg');
    wrapper.setProps({theme: 'contrast'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SavannahJeep-contrast.svg');
    // Space World
    wrapper.setProps({world: 'Space', theme: 'light'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
    wrapper.setProps({theme: 'gray'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SpaceShip-gray.svg');
    wrapper.setProps({theme: 'contrast'});
    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SpaceShip-contrast.svg');
});

test('When a world has enableFlipCharacter=true, character icon gets class names to rotate and enable flip', () => {
    expect.assertions(18);
    const { wrapper } = createShallowCharacterPositionController();

    // With default character facing right, i.e. East
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle2')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face Southeast
    wrapper.setProps({characterState: new CharacterState(1, 1, 3, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle3')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face South
    wrapper.setProps({characterState: new CharacterState(1, 1, 4, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle4')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face Southwest
    wrapper.setProps({characterState: new CharacterState(1, 1, 5, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle5')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face West
    wrapper.setProps({characterState: new CharacterState(1, 1, 6, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle6')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face Northwest
    wrapper.setProps({characterState: new CharacterState(1, 1, 7, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle7')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face North
    wrapper.setProps({characterState: new CharacterState(1, 1, 0, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle0')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face Northeast
    wrapper.setProps({characterState: new CharacterState(1, 1, 1, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle1')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);

    // Set characterState prop to make the character face East again
    wrapper.setProps({characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 2, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle2')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(true);
});

test('When a world has enableFlipCharacter=false, character icon gets class name to rotate only', () => {
    expect.assertions(18);
    const { wrapper } = createShallowCharacterPositionController({
        world: 'Landmarks'
    });

    // With default character facing right, i.e. East
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle2')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face Southeast
    wrapper.setProps({characterState: new CharacterState(1, 1, 3, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle3')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face South
    wrapper.setProps({characterState: new CharacterState(1, 1, 4, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle4')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face Southwest
    wrapper.setProps({characterState: new CharacterState(1, 1, 5, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle5')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face West
    wrapper.setProps({characterState: new CharacterState(1, 1, 6, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle6')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face Northwest
    wrapper.setProps({characterState: new CharacterState(1, 1, 7, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle7')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face North
    wrapper.setProps({characterState: new CharacterState(1, 1, 0, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle0')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face Northeast
    wrapper.setProps({characterState: new CharacterState(1, 1, 1, [], new SceneDimensions(1, 100, 1, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle1')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);

    // Set characterState prop to make the character face East again
    wrapper.setProps({characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 2, 100))});
    expect(getCharacterIcon(wrapper).hasClass('CharacterPositionController__character-column-character--angle2')).toBe(true);
    expect(getCharacterIcon(wrapper).hasClass(characterEnableFlipClassName)).toBe(false);
});

test('When in custom background edit mode, show the paintbrush button and hide the turn buttons', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundEditMode: true
    });

    expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('Paintbrush.svg');

    expect(getCharacterPositionButton(wrapper, 'turnLeft').exists()).toBe(false);
    expect(getCharacterPositionButton(wrapper, 'turnRight').exists()).toBe(false);
    expect(getCharacterPositionButton(wrapper, 'up').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'right').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'down').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'left').exists()).toBe(true);
});

test('When no tile is selected, the paintbrush button is disabled', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundEditMode: true,
        selectedCustomBackgroundTile: null
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(true);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('paint background square');
});

test('When a tile is selected, the paintbrush button is enbled and its aria-label includes information about the selected tile', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundEditMode: true,
        selectedCustomBackgroundTile: '1'
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(false);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('paint wall');
});

test('When the eraser is selected, the paintbrush button is enbled and its aria-label is "erase square"', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundEditMode: true,
        selectedCustomBackgroundTile: '0'
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(false);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('erase square');
});
