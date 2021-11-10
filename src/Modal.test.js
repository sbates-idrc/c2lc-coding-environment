// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Modal from './Modal';

configure({ adapter: new Adapter() });

const defaultModalProps = {
    show: true,
    focusOnOpenSelector: '.focusElement',
    focusOnCloseSelector: '.onCloseElement',
};

function createMountModal(props) {
    const mockOnClose = jest.fn();
    const wrapper = mount(
        React.createElement(
            Modal,
            Object.assign(
                {},
                defaultModalProps,
                {
                    onClose: mockOnClose
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockOnClose
    };
};

function findModal(modalWrapper) {
    return modalWrapper.find('.Modal');
}

function findModalContainer(modalWrapper) {
    return modalWrapper.find('.Modal__container');
}

describe('Modal component takes 3 aria related attributes as an option property', () => {
    test('ariaLabel', () => {
        expect.assertions(1);
        const { wrapper } = createMountModal({ariaLabel: 'has aria label'});
        const modal = findModal(wrapper);
        expect(modal.get(0).props['aria-label']).toBe('has aria label');
    });
    test('ariaLabelledById', () => {
        expect.assertions(1);
        const { wrapper } = createMountModal({ariaLabelledById: 'ariaLabelledBy'});
        const modal = findModal(wrapper);
        expect(modal.get(0).props['aria-labelledby']).toBe('ariaLabelledBy');
    });
    test('ariaDescribedById', () => {
        expect.assertions(1);
        const { wrapper } = createMountModal({ariaDescribedById: 'ariaDescribedBy'});
        const modal = findModal(wrapper);
        expect(modal.get(0).props['aria-describedby']).toBe('ariaDescribedBy');
    });
});

describe('Modal closes on two different actions', () => {
    test('On press Escape key', () => {
        expect.assertions(1);
        const { wrapper, mockOnClose } = createMountModal();
        const modalContainer = findModalContainer(wrapper);
        modalContainer.simulate('keyDown', {key: 'Escape'});
        expect(mockOnClose.mock.calls.length).toBe(1);
    });
    test('On clicking Backdrop', () => {
        expect.assertions(1);
        const { wrapper, mockOnClose } = createMountModal();
        const modalContainer = findModalContainer(wrapper);
        modalContainer.simulate('click');
        expect(mockOnClose.mock.calls.length).toBe(1);
    });
});

//TODO: Find a better pattern to ensure detach is always done
describe('Focus logic', () => {
    jest.spyOn(global, 'setTimeout');
    test('When the modal opens, focus is set on element specified by "focusOnOpenSelector" prop', () => {
        expect.assertions(1);
        const mockFocus = jest.fn();
        const wrapper = mount(
            <Modal
                show={false}
                focusOnOpenSelector='.button1'
                focusOnCloseSelector='.onCloseElement'
                onClose={() => {}}>
                <div>
                    <button onFocus={mockFocus} className='button1'>button1</button>
                    <button className='button2'>button2</button>
                </div>
            </Modal>,
            // $FlowFixMe: document.body may be a null
            {attachTo: document.body}
        );
        wrapper.setProps({show: true});
        // TODO: Find a way to check that focus is on button1, either with :focus selector or
        // onFocus mock function on the button is called
        expect(setTimeout).toHaveBeenCalledTimes(1);

        // make sure to detach after attach to body
        wrapper.detach();
    });
    test('When the modal closes, focus is set on element specified by "focusOnCloseSelector" prop', () => {
        expect.assertions(1);
        const wrapper = mount(
            <div>
                <Modal
                    show={true}
                    focusOnOpenSelector='.focusElement'
                    focusOnCloseSelector='#focusOnClose'
                    onClose={jest.fn()}/>
                <button id='focusOnClose'>focus</button>
            </div>,
            // $FlowFixMe: document.body may be a null
            {attachTo: document.body}
        );
        wrapper.setProps({
            children:
            <React.Fragment>
                <Modal
                    show={false}
                    focusOnOpenSelector='.focusElement'
                    focusOnCloseSelector='#focusOnClose'
                    onClose={jest.fn()}/>
                <button id='focusOnClose'>focus</button>
            </React.Fragment>
        });
        expect(wrapper.find('#focusOnClose').is(':focus')).toBe(true);
        // make sure to detach after attach to body
        wrapper.detach();
    });
    test('Focus is trapped within the modal', () => {
        //expect.assertions(3);
        const wrapper = mount(
            <Modal
                show={false}
                focusOnOpenSelector='.focusElement'
                focusOnCloseSelector='.onCloseElement'
                onClose={() => {}}>
                <div>
                    <button className='button1'>button1</button>
                    <button className='button2'>button2</button>
                </div>
            </Modal>,
            // $FlowFixMe: document.body may be a null
            {attachTo: document.body}
        );
        const modalContainer = findModalContainer(wrapper);
        //console.log(modalBackdrop.get(0));
        // Focus event is fired on the modal container
        modalContainer.simulate('focus');
        expect(wrapper.find('.button1').is(':focus')).toBe(true);
        modalContainer.simulate('focus');
        expect(wrapper.find('.button2').is(':focus')).toBe(true);
        modalContainer.simulate('focus');
        expect(wrapper.find('.button1').is(':focus')).toBe(true);
        // make sure to detach after attach to body
        wrapper.detach();
    });
});
