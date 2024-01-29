// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow, ReactWrapper } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';
import CharacterPositionController from './CharacterPositionController';
import * as TestUtils from './TestUtils';

configure({ adapter: new Adapter()});

type ButtonName = 'turnLeft' | 'turnRight' | 'up' | 'right' | 'down' | 'left';

const defaultCharacterPositionControllerProps = {
    x: 1,
    y: 1,
    sceneDimensions: new SceneDimensions(1, 100, 1, 100),
    editingDisabled: false,
    customBackgroundDesignMode: false,
    selectedCustomBackgroundTile: null
};

function createShallowCharacterPositionController(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();
    const mockClickSetStartButton = jest.fn();
    const mockClickPaintbrushButton = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            CharacterPositionController.WrappedComponent,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    intl: intl,
                    onClickTurnLeft: () => {},
                    onClickTurnRight: () => {},
                    onClickLeft: () => {},
                    onClickRight: () => {},
                    onClickUp: () => {},
                    onClickDown: () => {},
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition,
                    onClickSetStartButton: mockClickSetStartButton,
                    onClickPaintbrushButton: mockClickPaintbrushButton
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
        mockClickSetStartButton,
        mockClickPaintbrushButton
    };
}

function createMountCharacterPositionController(props) {
    const mockClickTurnLeft = jest.fn();
    const mockClickTurnRight = jest.fn();
    const mockClickLeft = jest.fn();
    const mockClickRight = jest.fn();
    const mockClickUp = jest.fn();
    const mockClickDown = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();
    const mockClickSetStartButton = jest.fn();
    const mockClickPaintbrushButton = jest.fn();

    const wrapper = mount(
        React.createElement(
            CharacterPositionController,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    onClickTurnLeft: mockClickTurnLeft,
                    onClickTurnRight: mockClickTurnRight,
                    onClickLeft: mockClickLeft,
                    onClickRight: mockClickRight,
                    onClickUp: mockClickUp,
                    onClickDown: mockClickDown,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition,
                    onClickSetStartButton: mockClickSetStartButton,
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
        mockClickTurnLeft,
        mockClickTurnRight,
        mockClickLeft,
        mockClickRight,
        mockClickUp,
        mockClickDown,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
        mockClickSetStartButton,
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

function getCenterButtonIcon(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.CharacterPositionController__centerButtonIcon');
}

function getSetStartButton(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.CharacterPositionController__setStartButton');
}

function getPaintbrushButton(wrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return wrapper.find('.CharacterPositionController__paintbrushButton');
}

describe('Using change character position buttons', () => {
    test.each([
        ['turnLeft', 'mockClickTurnLeft'],
        ['turnRight', 'mockClickTurnRight'],
        ['left', 'mockClickLeft'],
        ['right', 'mockClickRight'],
        ['up', 'mockClickUp'],
        ['down', 'mockClickDown']
    ])('Click/Press "%s" button ', (buttonName, expectedCallback) => {
        expect.assertions(11);

        const obj = createMountCharacterPositionController();
        const button = getCharacterPositionButton(obj.wrapper, buttonName);

        button.simulate('click');
        expect(obj[expectedCallback].mock.calls.length).toBe(1);
        button.simulate('keydown', { key: ' ' });
        expect(obj[expectedCallback].mock.calls.length).toBe(2);

        // Verify that expectedCallback is the only one that has been called
        for (const prop in obj) {
            if (prop.startsWith('mock') && prop !== expectedCallback) {
                expect(obj[prop].mock.calls.length).toBe(0);
            }
        }
    });

    test.each([
        'turnLeft',
        'turnRight',
        'left',
        'right',
        'up',
        'down'
    ])('Click/Press "%s" button when editingDisabled is true', (buttonName) => {
        expect.assertions(11);

        const obj = createMountCharacterPositionController({
            editingDisabled: true
        });
        const button = getCharacterPositionButton(obj.wrapper, buttonName);

        expect(button.get(0).props.className.includes('--disabled')).toBe(true);

        button.simulate('click');
        button.simulate('keydown', { key: ' ' });

        // Verify that no callbacks were called
        for (const prop in obj) {
            if (prop.startsWith('mock')) {
                expect(obj[prop].mock.calls.length).toBe(0);
            }
        }
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
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(24);

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleXPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(secondSampleXPosition);

        characterXPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleXPosition), 'Enter'));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterXPosition.mock.calls[1][0]).toBe(1);
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
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(2);

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleYPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(secondSampleYPosition);

        characterYPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleYPosition), 'Enter'));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterYPosition.mock.calls[1][0]).toBe(8);
    });
});

test('When in default mode, show the set start button and the turn buttons', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundDesignMode: false
    });

    expect(getCenterButtonIcon(wrapper).get(0).type.render().props.children).toBe('SetStartIcon.svg');

    expect(getCharacterPositionButton(wrapper, 'turnLeft').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'turnRight').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'up').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'right').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'down').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'left').exists()).toBe(true);
});

test('When the set start button is clicked, the provided callback is called', () => {
    const {
        wrapper,
        mockClickSetStartButton,
        mockClickPaintbrushButton
    } = createShallowCharacterPositionController({
        customBackgroundDesignMode: false
    });

    getSetStartButton(wrapper).simulate('click');

    expect(mockClickSetStartButton.mock.calls.length).toBe(1);
    expect(mockClickPaintbrushButton.mock.calls.length).toBe(0);
});

test('When in custom background design mode, show the paintbrush button and hide the turn buttons', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundDesignMode: true
    });

    expect(getCenterButtonIcon(wrapper).get(0).type.render().props.children).toBe('PaintbrushIcon.svg');

    expect(getCharacterPositionButton(wrapper, 'turnLeft').exists()).toBe(false);
    expect(getCharacterPositionButton(wrapper, 'turnRight').exists()).toBe(false);
    expect(getCharacterPositionButton(wrapper, 'up').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'right').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'down').exists()).toBe(true);
    expect(getCharacterPositionButton(wrapper, 'left').exists()).toBe(true);
});

test('When no tile is selected, the paintbrush button is disabled', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundDesignMode: true,
        selectedCustomBackgroundTile: null
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(true);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('paint background square');
});

test('When a tile is selected, the paintbrush button is enbled and its aria-label includes information about the selected tile', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundDesignMode: true,
        selectedCustomBackgroundTile: '1'
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(false);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('paint wall');
});

test('When the eraser is selected, the paintbrush button is enbled and its aria-label is "erase square"', () => {
    const { wrapper } = createShallowCharacterPositionController({
        customBackgroundDesignMode: true,
        selectedCustomBackgroundTile: '0'
    });

    expect(getPaintbrushButton(wrapper).prop('disabled')).toBe(false);
    expect(getPaintbrushButton(wrapper).prop('ariaLabel')).toBe('erase square');
});

test('When the pintbrush button is clicked, the provided callback is called', () => {
    const {
        wrapper,
        mockClickSetStartButton,
        mockClickPaintbrushButton
    } = createShallowCharacterPositionController({
        customBackgroundDesignMode: true
    });

    getPaintbrushButton(wrapper).simulate('click');

    expect(mockClickSetStartButton.mock.calls.length).toBe(0);
    expect(mockClickPaintbrushButton.mock.calls.length).toBe(1);
});
