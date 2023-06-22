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

const defaultCharacterPositionControllerProps = {
    interpreterIsRunning: false,
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100)),
    editingDisabled: false,
    theme: 'light',
    world: 'Sketchpad'
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
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
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
    };
}

function createMountCharacterPositionController(props) {
    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();

    const wrapper = mount(
        React.createElement(
            CharacterPositionController,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
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
        mockChangeCharacterYPosition
    };
}

function getCharacterPositionButton(characterPositionControllerWrapper: ReactWrapper<HTMLElement>, directionName: string): ReactWrapper<HTMLElement> {
    return characterPositionControllerWrapper.find('.CharacterPositionController__character-position-button').filter({value: directionName}).at(0);
}

function getCharacterPositionCoordinateBoxes(characterPositionControllerWrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return characterPositionControllerWrapper.find('.ProgramBlock__character-position-coordinate-box');
}

function getCharacterIcon(characterPositionControllerWrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return characterPositionControllerWrapper.find('.CharacterPositionController__character-column-character');
}

function makeColumnLabelCurrentTarget(value: string) {
    return {
        name: 'xPosition',
        value
    };
}

function makeRowLabelCurrentTarget(value: string) {
    return {
        name: 'yPosition',
        value
    };
}

describe('Character position buttons', () => {
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button ', (directionName) => {
        expect.assertions(4);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController();
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterPosition.mock.calls[0][0]).toBe(directionName);

        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterPosition.mock.calls[1][0]).toBe(directionName);
    });
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button when editingDisabled Prop is true', (directionName) => {
        expect.assertions(3);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController({editingDisabled: true});
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);
        expect(characterPositionButton.get(0).props.className.includes('--disabled')).toBe(true);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
    });
});

describe('Column label input (X)', () => {
    let wrapper
    let mockChangeCharacterXPosition;
    let characterXPositionCoordinateBox;

    beforeEach(() => {
        ({ wrapper, mockChangeCharacterXPosition } = createShallowCharacterPositionController());
        characterXPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(0);
    });

    test('When there is a change to the column label value, and it is valid, the blur event calls the provided X position change handler', () => {
        expect.assertions(3);
        const newColumnLabel = 'X';

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeColumnLabelCurrentTarget(newColumnLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(newColumnLabel);

        characterXPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeColumnLabelCurrentTarget(newColumnLabel)));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(24); // Column 'X' is number 24
    });

    test('When there is no change to the column label value, the blur event does not call the provided X position change handler', () => {
        expect.assertions(2);
        expect(wrapper.instance().state.characterColumnLabel).toBe('A');
        characterXPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeColumnLabelCurrentTarget('A')));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(0);
    });

    test('When the changed column label value is invalid, the blur event resets the label back to what it was', () => {
        expect.assertions(3);
        const newColumnLabel = '3';

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeColumnLabelCurrentTarget(newColumnLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(newColumnLabel);

        characterXPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeColumnLabelCurrentTarget(newColumnLabel)));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(0);
        expect(wrapper.instance().state.characterColumnLabel).toBe('A');
    });

    test('When there is a change to the column label value, and it is valid, pressing Enter calls the provided X position change handler', () => {
        expect.assertions(3);
        const newColumnLabel = 'X';

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeColumnLabelCurrentTarget(newColumnLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(newColumnLabel);

        characterXPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(makeColumnLabelCurrentTarget(newColumnLabel), 'Enter'));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(24); // Column 'X' is number 24
    });
});

describe('Row label input (Y)', () => {
    let wrapper
    let mockChangeCharacterYPosition;
    let characterYPositionCoordinateBox;

    beforeEach(() => {
        ({ wrapper, mockChangeCharacterYPosition } = createShallowCharacterPositionController());
        characterYPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(1);
    });

    test('When there is a change to the row label value, and it is valid, the blur event calls the provided Y position change handler', () => {
        expect.assertions(3);
        const newRowLabel = '2';

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeRowLabelCurrentTarget(newRowLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(newRowLabel);

        characterYPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeRowLabelCurrentTarget(newRowLabel)));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(2);
    });

    test('When there is no change to the row label value, the blur event does not call the provided Y position change handler', () => {
        expect.assertions(2);
        expect(wrapper.instance().state.characterRowLabel).toBe('1');
        characterYPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeRowLabelCurrentTarget('1')));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(0);
    });

    test('When the changed row label value is invalid, the blur event resets the label back to what it was', () => {
        expect.assertions(3);
        const newRowLabel = 'A';

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeRowLabelCurrentTarget(newRowLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(newRowLabel);

        characterYPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(makeRowLabelCurrentTarget(newRowLabel)));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(0);
        expect(wrapper.instance().state.characterRowLabel).toBe('1');
    });

    test('When there is a change to the row label value, and it is valid, pressing Enter calls the provided Y position change handler', () => {
        expect.assertions(3);
        const newRowLabel = '2';

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(makeRowLabelCurrentTarget(newRowLabel)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(newRowLabel);

        characterYPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(makeRowLabelCurrentTarget(newRowLabel), 'Enter'));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(2);
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
