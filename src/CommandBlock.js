// @flow

import * as React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { ReactComponent as Forward1 } from './svg/Forward1.svg';
import { ReactComponent as Forward2 } from './svg/Forward2.svg';
import { ReactComponent as Forward3 } from './svg/Forward3.svg';
import { ReactComponent as Backward1 } from './svg/Backward1.svg';
import { ReactComponent as Backward2 } from './svg/Backward2.svg';
import { ReactComponent as Backward3 } from './svg/Backward3.svg';
import { ReactComponent as Left45 } from './svg/Left45.svg';
import { ReactComponent as Left90 } from './svg/Left90.svg';
import { ReactComponent as Left180 } from './svg/Left180.svg';
import { ReactComponent as Right45 } from './svg/Right45.svg';
import { ReactComponent as Right90 } from './svg/Right90.svg';
import { ReactComponent as Right180 } from './svg/Right180.svg';
import { ReactComponent as Loop } from './svg/Loop.svg';

type CommandBlockProps = {
    commandName: string,
    disabled: boolean,
    loopLabel?: string,
    loopIterationsLeft?: ?number,
    className?: string,
    onClick: (evt: SyntheticEvent<HTMLButtonElement>) => void,
};

// TODO: Revise this once there is a proper strategy for typing SVG-backed
//       components.
export const commandBlockIconTypes = new Map<string, any>([
    ['forward1', Forward1],
    ['forward2', Forward2],
    ['forward3', Forward3],
    ['backward1', Backward1],
    ['backward2', Backward2],
    ['backward3', Backward3],
    ['left45', Left45],
    ['left90', Left90],
    ['left180', Left180],
    ['right45', Right45],
    ['right90', Right90],
    ['right180', Right180],
    ['loop', Loop]
]);

export default React.forwardRef<CommandBlockProps, Button>(
    (props, ref) => {
        const {
            commandName,
            disabled,
            loopLabel,
            loopIterationsLeft,
            className,
            onClick,
            ...otherProps
        } = props;

        let children = null;
        if (commandName === 'startLoop' || commandName === 'endLoop') {
            children =
                <div className='command-block-loop-block-container'>
                    <div className='command-block-loop-label-container'>
                        {loopLabel}
                    </div>
                    {commandName === 'startLoop' ?
                        <input
                            className='command-block-loop-counter'
                            maxLength='2'
                            size='2'
                            type='text'
                            value={loopIterationsLeft}
                            readOnly={true} />:
                        <></>
                    }
                </div>
        } else {
            const iconType = commandBlockIconTypes.get(commandName);
            if (iconType) {
                children = React.createElement(
                    iconType,
                    {
                        className: 'command-block-svg'
                    }
                );
            }
        }

        const classes = classNames(
            'command-block',
            className
        );

        return React.createElement(
            AriaDisablingButton,
            Object.assign({
                'variant': `command-block--${commandName}`,
                'className': classes,
                'onClick': onClick,
                'disabled': disabled,
                'ref': ref
            }, otherProps),
            children
        );
    }
);
