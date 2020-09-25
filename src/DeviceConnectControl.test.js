// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';
import DeviceConnectControl from './DeviceConnectControl';

configure({ adapter: new Adapter()});

function hasDisabledClass(wrapper) {
    return wrapper.find('.DeviceConnectControl').hasClass('DeviceConnectControl--disabled');
}

function buttonIsDisabled(wrapper) {
    return wrapper.find('.DeviceConnectControl__button').getElement().props['disabled'];
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

test('When disabled is false, the Connect button should not have the disabled class name', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    expect(hasDisabledClass(wrapper)).toBe(false);
    expect(buttonIsDisabled(wrapper)).toBe(false);
});

test('When disabled is true, the Connect button should have the disabled class name', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={true}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    expect(hasDisabledClass(wrapper)).toBe(true);
    expect(buttonIsDisabled(wrapper)).toBe(true);
});

test('When not connected, the status area should be empty', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='notConnected'
            onClickConnect={() => {}}/>
    );
    // There should be a single status element
    const status = wrapper.find('[role="status"]');
    expect(status).toHaveLength(1);
    // That is empty
    expect(status.children()).toHaveLength(0);
});

test('When connected, the status area should have an img with the connected aria-label', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='connected'
            onClickConnect={() => {}}/>
    );
    // There should be a single status element
    const status = wrapper.find('[role="status"]');
    expect(status).toHaveLength(1);
    // With a single img
    const img = status.find('[role="img"]');
    expect(img).toHaveLength(1);
    expect(img.prop('aria-label')).toBe(intl.messages['DeviceConnectControl.connected']);
    expect(img.children().hasClass('DeviceConnectControl__dash-icon--connected')).toBe(true);
});

test('When connecting, the status area should have an img with the connecting aria-label', () => {
    const wrapper = shallow(
        <DeviceConnectControl.WrappedComponent
            intl={intl}
            disabled={false}
            connectionStatus='connecting'
            onClickConnect={() => {}}/>
    );
    // There should be a single status element
    const status = wrapper.find('[role="status"]');
    expect(status).toHaveLength(1);
    // With a single img
    const img = status.find('[role="img"]');
    expect(img).toHaveLength(1);
    expect(img.prop('aria-label')).toBe(intl.messages['DeviceConnectControl.connecting']);
});
