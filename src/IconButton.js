// @flow

import * as React from 'react';
import classNames from 'classnames';
import './IconButton.scss';

type IconButtonProps = {
    children: any,
    ariaLabel: string,
    onClick: () => void,
    onKeyDown: (e: KeyboardEvent) => void
};

class IconButton extends React.Component<IconButtonProps, {}> {
    render() {
        // C2LC-486 uses classNames method, so keep this structure for now
        const classes = classNames(
            "IconButton"
        );
        return (
            <div
                aria-label={this.props.ariaLabel}
                className={classes}
                role='button'
                tabIndex={0}
                onClick={this.props.onClick}
                onKeyDown={this.props.onKeyDown}
            >
                {this.props.children}
            </div>
        );
    }
};

export default IconButton;
