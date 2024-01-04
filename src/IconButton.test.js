// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import IconButton from './IconButton';
import type { IconButtonProps } from './IconButton';

configure({ adapter: new Adapter()});

function createShallowIconButton(props: ?$Shape<IconButtonProps>) {
    const clickHandler = jest.fn();
    const wrapper = shallow(
        React.createElement(
            IconButton,
            Object.assign(
                ({
                    ariaLabel: "X marks the spot",
                    children: "X",
                    disabled: false,
                    onClick: clickHandler
                }: IconButtonProps),
                props
            )
        )
    );
    return { wrapper, clickHandler };
}

describe('An IconButton can be disabled', () => {
    describe('Given disabled is false', () => {
        test('Then the button should be activatable with a space', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton();

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('keyDown', { key: " ", preventDefault: () => {}});

            expect(clickHandler.mock.calls.length).toBe(1);
        });

        test('Then the button should be activatable with the enter key', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton();

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('keyDown', { key: "Enter", preventDefault: () => {}});

            expect(clickHandler.mock.calls.length).toBe(1);
        });

        test('Then the button should be activatable with a click', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton();

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('click');

            expect(clickHandler.mock.calls.length).toBe(1);
        });

        test('Then aria-disabled should be set to false', () => {
            expect.assertions(1);
            const {wrapper} = createShallowIconButton();

            expect(wrapper.props()['aria-disabled']).toBe(false);
        });
    });

    describe('Given disabled is true', () => {
        test('Then the button should not be activatable with a space', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton({ disabled: true });

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('keyDown', { key: " ", preventDefault: () => {}});

            expect(clickHandler.mock.calls.length).toBe(0);
        });

        test('Then the button should not be activatable with the enter key', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton({ disabled: true });

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('keyDown', { key: "Enter", preventDefault: () => {}});

            expect(clickHandler.mock.calls.length).toBe(0);
        });

        test('Then the button should not be activatable with a click', () => {
            expect.assertions(2);
            const {wrapper, clickHandler} = createShallowIconButton({ disabled: true });

            expect(clickHandler.mock.calls.length).toBe(0);

            wrapper.simulate('click');

            expect(clickHandler.mock.calls.length).toBe(0);
        });

        test('Then aria-disabled should be set to true', () => {
            expect.assertions(1);
            const {wrapper} = createShallowIconButton({ disabled: true });

            expect(wrapper.props()['aria-disabled']).toBe(true);
        });

    })
});

describe('ariaPressed', () => {
    test('Given no ariaPressed prop is set, then the aria-pressed attribute should not be set and the IconButton--pressed class should not be present', () => {
        expect.assertions(2);
        const {wrapper} = createShallowIconButton();
        expect(wrapper.prop('aria-pressed')).toBeUndefined();
        expect(wrapper.hasClass('IconButton--pressed')).toBe(false);
    });

    test('Given the ariaPressed prop is true, then the aria-pressed attribute should be true and the IconButton--pressed class should be present', () => {
        expect.assertions(2);
        const {wrapper} = createShallowIconButton({ ariaPressed: true });
        expect(wrapper.prop('aria-pressed')).toBe(true);
        expect(wrapper.hasClass('IconButton--pressed')).toBe(true);
    });

    test('Given the ariaPressed prop is false, then the aria-pressed attribute should be false and the IconButton--pressed class should not be present', () => {
        expect.assertions(2);
        const {wrapper} = createShallowIconButton({ ariaPressed: false });
        expect(wrapper.prop('aria-pressed')).toBe(false);
        expect(wrapper.hasClass('IconButton--pressed')).toBe(false);
    });
});
