// @flow

import * as React from 'react';
import classNames from 'classnames';
import './TextButton.scss';

export type TextButtonProps = {
    id?: string,
    key?: string,
    className?: string,
    label: string,
    isPrimary?: boolean,
    children?: any,
    onClick: () => void
};

class TextButton extends React.Component<TextButtonProps, {}> {
    static defaultProps = {
        isPrimary: false
    };

    handleClick = (event: Event) => {
        event.preventDefault();
        this.props.onClick();
    }

    render() {
        const classes = classNames(
            "TextButton",
            this.props.className,
            this.props.isPrimary ? "TextButton__primaryButton" : "TextButton__secondaryButton"
        );
        return (
            <button
                id={this.props.id}
                aria-label={this.props.label}
                className={classes}
                onClick={this.handleClick}
            >
                {this.props.children}
            </button>
        );
    }
};

export default TextButton;
