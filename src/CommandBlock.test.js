// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import CommandBlock from './CommandBlock';

configure({ adapter: new Adapter() });

const defaultCommandBlockProps = {
    commandName: 'forward1',
    disabled: false,
    onClick: () => {}
};

function createMountCommandBlock(props) {
    const wrapper = mount(
        React.createElement(
            CommandBlock,
            Object.assign(
                {},
                defaultCommandBlockProps,
                props
            )
        )
    );

    return wrapper;
}

function getCommandBlock(wrapper) {
    return wrapper.find('.command-block');
}

describe('Rendering commands', () => {
    test('forward1', () => {
        const wrapper = createMountCommandBlock();
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--forward1');
        expect(getCommandBlock(wrapper).get(0).props.children.type.render().type).toBe('svg');
    });
    test('backward1', () => {
        const wrapper = createMountCommandBlock({commandName: 'backward1'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--backward1');
        expect(getCommandBlock(wrapper).get(0).props.children.type.render().type).toBe('svg');
    });
    test('left45', () => {
        const wrapper = createMountCommandBlock({commandName: 'left45'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--left45');
        expect(getCommandBlock(wrapper).get(0).props.children.type.render().type).toBe('svg');
    });
    test('right45', () => {
        const wrapper = createMountCommandBlock({commandName: 'right45'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--right45');
        expect(getCommandBlock(wrapper).get(0).props.children.type.render().type).toBe('svg');
    });
    test('startLoop', () => {
        const wrapper = createMountCommandBlock({commandName: 'startLoop'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--startLoop');
        expect(getCommandBlock(wrapper).get(0).props.children.type).toBe('div');
    });
    test('endLoop', () => {
        const wrapper = createMountCommandBlock({commandName: 'endLoop'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--endLoop');
        expect(getCommandBlock(wrapper).get(0).props.children.type).toBe('div');
    });
})
