// @flow

import * as React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { ReactComponent as ArrowForward } from './svg/ArrowForward.svg';
import { ReactComponent as ArrowTurnLeft } from './svg/ArrowTurnLeft.svg';
import { ReactComponent as ArrowTurnRight } from './svg/ArrowTurnRight.svg';

type CommandBlockProps = {
    commandName: string,
    onClick: (evt: SyntheticEvent<HTMLButtonElement>) => void,
    disabled: boolean,
    className?: string
};

// TODO: Revise this once there is a proper strategy for typing SVG-backed
//       components.
const commandBlockIconTypes = new Map<string, any>([
    ['forward', ArrowForward],
    ['left', ArrowTurnLeft],
    ['right', ArrowTurnRight]
]);

export default React.forwardRef<CommandBlockProps, Button>(
    (props, ref) => {
        const {
            commandName,
            onClick,
            disabled,
            className,
            ...otherProps
        } = props;

        let icon = null;
        const iconType = commandBlockIconTypes.get(commandName);
        if (iconType) {
            icon = React.createElement(
                iconType,
                {
                    className: 'command-block-svg'
                }
            );
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
            icon
        );
    }
);
