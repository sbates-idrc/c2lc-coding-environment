// @flow

import React from 'react';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ReactComponent as SlowIcon } from './svg/Slow.svg';
import { ReactComponent as FastIcon } from './svg/Fast.svg';
import './ProgramSpeedController.scss';

type ProgramSpeedControllerProps = {
    intl: IntlShape,
    numValues: number,
    value: number,
    onChange: (value: number) => void
};

class ProgramSpeedController extends React.Component<ProgramSpeedControllerProps, {}> {
    handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.onChange(parseInt(e.target.value));
    }

    render() {
        return (
            <div className='ProgramSpeedController__container'>
                <SlowIcon aria-hidden={true} />
                {
                    <input
                        aria-label={`${this.props.intl.formatMessage({id:'ProgramSpeedController.slider'})}`}
                        className='ProgramSpeedController__slider'
                        type='range'
                        min={1}
                        max={this.props.numValues}
                        value={this.props.value}
                        onChange={this.handleChange}
                    />
                }
                <FastIcon aria-hidden={true} />
            </div>
        );
    }
}

export default injectIntl(ProgramSpeedController);
