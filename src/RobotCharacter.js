// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import './RobotCharacter.scss';

type RobotCharacterProps = {
    transform: string,
    width: number
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    render() {
        const characterRadius = this.props.width / 2;
        const characterWidth = this.props.width * 0.75;
        return (
            <g
                className='RobotCharacter'
                transform={this.props.transform}>
                <RobotIcon
                    className='RobotCharacter__icon'
                    x={-characterWidth/2}
                    y={-characterWidth/2}
                    width={characterWidth}
                    height={characterWidth} />
                <circle className='RobotCharacter__container' r={characterRadius} />
            </g>
        );
    }
}
