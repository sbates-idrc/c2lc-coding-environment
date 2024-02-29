// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ProgramSpeedController from './ProgramSpeedController';
import messages from './messages.json';

configure({ adapter: new Adapter() });

function createMountProgramSpeedController(numValues: number, value: number) {
    const changeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramSpeedController,
            {
                numValues: numValues,
                value: value,
                onChange: changeHandler
            }
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

    return { wrapper, changeHandler };
}

function getProgramSpeedController(programSpeedControllerWrapper) {
    return programSpeedControllerWrapper.find('.ProgramSpeedController__slider').at(0);
}

test('Renders with the specified numValues and value', () => {
    expect.assertions(3);
    const { wrapper } = createMountProgramSpeedController(5, 3);
    const programSpeedController = getProgramSpeedController(wrapper);
    expect(programSpeedController.get(0).props.min).toBe(1);
    expect(programSpeedController.get(0).props.max).toBe(5);
    expect(programSpeedController.get(0).props.value).toBe(3);
});

test('When the controller changes, should call the onChange callback with the new value', () => {
    expect.assertions(2);
    const { wrapper, changeHandler } = createMountProgramSpeedController(5, 3);

    const programSpeedController = getProgramSpeedController(wrapper);
    programSpeedController.simulate('change', { target: { value: 4 } });

    expect(changeHandler.mock.calls.length).toBe(1);
    expect(changeHandler.mock.calls[0][0]).toBe(4);
});
