// @flow

import React from 'react';
import { Form } from 'react-bootstrap';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ReactComponent as SlowIcon } from './svg/Slow.svg';
import { ReactComponent as FastIcon } from './svg/Fast.svg';
import './ProgramSpeedController.scss';

type ProgramSpeedControllerProps = {
    intl: IntlShape,
    onChange: (e: SyntheticInputEvent<HTMLInputElement>) => void
};

class ProgramSpeedController extends React.Component<ProgramSpeedControllerProps, {}> {
    render() {
        return (
            <div className='ProgramSpeedController__container'>
                <SlowIcon />
                {//$FlowFixMe
                    <Form.Control
                        aria-label={`${this.props.intl.formatMessage({id:'ProgramSpeedController.slider'})}`}
                        className='ProgramSpeedController__slider'
                        type='range'
                        min='1'
                        max='9'
                        onChange={this.props.onChange} />
                }
                <FastIcon />
            </div>
        );
    }
}

export default injectIntl(ProgramSpeedController);
