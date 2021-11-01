// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import ModalWithFooter from './ModalWithFooter';

configure({ adapter: new Adapter()});

function createMountModalWithFooter(props) {
    const defaultModalWithFooterProps = {
        show: true,
        focusElementSelector: 'focusElement',
        focusOnCloseSelector: 'focusOnClose',
        onClose: () => {}
    };
    const wrapper = mount(
        React.createElement(
            ModalWithFooter,
            Object.assign(
                {},
                defaultModalWithFooterProps,
                props
            )
        )
    );

    return wrapper;
}

function getSecondaryButtonAtPosition(wrapper, position) {
    return wrapper.find('.ModalWithFooter__secondaryButton').at(position);
}

function getPrimaryButton(wrapper) {
    return wrapper.find('.ModalWithFooter__primaryButton').at(0);
}

describe('ModalWithFooter renders buttons with properties specified in buttonProperties properties', () => {
    test('Modal with secondary and primary buttons', () => {
        expect.assertions(4);
        const secondaryButtonLabel = 'cancel';
        const primaryButtonLabel = 'done';
        const secondaryButtonOnClick = jest.fn();
        const primaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: secondaryButtonLabel, onClick: secondaryButtonOnClick, isPrimary: false},
                {label: primaryButtonLabel, onClick: primaryButtonOnClick, isPrimary: true}
            ]
        });
        const secondaryButton = getSecondaryButtonAtPosition(wrapper, 0);
        expect(secondaryButton.get(0).props.children).toBe(secondaryButtonLabel);
        secondaryButton.simulate('click');
        expect(secondaryButtonOnClick.mock.calls.length).toBe(1);

        const primaryButton = getPrimaryButton(wrapper);
        expect(primaryButton.get(0).props.children).toBe(primaryButtonLabel);
        primaryButton.simulate('click');
        expect(primaryButtonOnClick.mock.calls.length).toBe(1);
    });
    test('Modal with only secondary button', () => {
        expect.assertions(3);
        const secondaryButtonLabel = 'cancel';
        const secondaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: secondaryButtonLabel, onClick: secondaryButtonOnClick, isPrimary: false}
            ]
        });
        const secondaryButton = getSecondaryButtonAtPosition(wrapper, 0);
        expect(secondaryButton.get(0).props.children).toBe(secondaryButtonLabel);
        secondaryButton.simulate('click');
        expect(secondaryButtonOnClick.mock.calls.length).toBe(1);

        const primaryButton = getPrimaryButton(wrapper);
        expect(primaryButton.get(0)).toBeUndefined();
    });
    test('Modal with only primary buttons', () => {
        expect.assertions(3);
        const primaryButtonLabel = 'done';
        const primaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: primaryButtonLabel, onClick: primaryButtonOnClick, isPrimary: true}
            ]
        });
        const secondaryButton = getSecondaryButtonAtPosition(wrapper, 0);
        expect(secondaryButton.get(0)).toBeUndefined();

        const primaryButton = getPrimaryButton(wrapper);
        expect(primaryButton.get(0).props.children).toBe(primaryButtonLabel);
        primaryButton.simulate('click');
        expect(primaryButtonOnClick.mock.calls.length).toBe(1);
    });
});

