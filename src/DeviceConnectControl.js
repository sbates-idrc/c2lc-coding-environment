// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type {DeviceConnectionStatus} from './types';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as DashConnectionIcon } from './svg/Dash-Small.svg';
import { ReactComponent as ConnectingIcon } from './svg/Connecting.svg';
import './DeviceConnectControl.scss';

type DeviceConnectControlProps = {
    intl: IntlShape,
    children: React.Element<any>, // Button contents
    disabled: boolean,
    connectionStatus: DeviceConnectionStatus,
    onClickConnect: () => void
};

class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    connectionStatusIcon() {
        switch (this.props.connectionStatus) {
            case 'connected':
                return (
                    <span
                        role='img'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connected'})}>
                        <DashConnectionIcon className='DeviceConnectControl__dash-icon DeviceConnectControl__dash-icon--connected' />
                    </span>
                );
            case 'connecting':
                return (
                    <span>
                        <DashConnectionIcon className='DeviceConnectControl__dash-icon' />
                        <span
                            role='img'
                            aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connecting'})}>
                                <ConnectingIcon className='DeviceConnectControl__status-icon' />
                        </span>
                    </span>
                );
            default:
                return null;
        }

    }

    render() {
        const classNames = ['DeviceConnectControl'];
        if (this.props.disabled) {
            classNames.push('DeviceConnectControl--disabled')
        }
        return (
            <div className={classNames.join(' ')}>
                <span role='status' className='DeviceConnectControl__status-icon-container'>
                    {this.connectionStatusIcon()}
                </span>
                <AriaDisablingButton
                    className='DeviceConnectControl__button'
                    disabled={this.props.disabled}
                    onClick={this.props.onClickConnect}>
                    {this.props.children}
                </AriaDisablingButton>
            </div>
        );
    }
}

export default injectIntl(DeviceConnectControl);
