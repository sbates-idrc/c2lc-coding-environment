// @flow

import * as React from 'react';
import classNames from 'classnames';

type AriaDisablingButtonProps = {
    onClick: (evt: any) => void,
    disabled: boolean,
    className?: string,
    disabledClassName?: string,
    children?: React.Node
};

const AriaDisablingButton = React.forwardRef<AriaDisablingButtonProps, HTMLElement>(
    (props, ref) => {
        const {
            onClick,
            disabled,
            className,
            disabledClassName,
            children,
            ...otherProps
        } = props;

        const classes = classNames(
            className,
            disabled && disabledClassName,
            'btn' // For compatibility with Bootstrap
        );

        return React.createElement(
            'button',
            Object.assign({
                'type': 'button',
                'onClick': disabled ? undefined : onClick,
                'aria-disabled': disabled,
                'className': classes,
                'ref': ref
            }, otherProps),
            children
        );
    }
);

export default AriaDisablingButton;
