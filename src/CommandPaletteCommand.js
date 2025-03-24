// @flow

import React from 'react';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type {CommandName} from './types';


type CommandPaletteCommandProps = {
    commandName: CommandName,
    intl: IntlShape,
    isDraggingCommand: boolean,
    selectedActionName: ?CommandName,
    onSelect: (commandName: CommandName) => void,
    onDragStart: (commandName: CommandName) => void,
    onDragEnd: () => void
};

class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        this.props.onSelect(this.props.commandName);
    };

    /* istanbul ignore next */
    handleDragStart = () => {
        this.props.onDragStart(this.props.commandName);
    };

    /* istanbul ignore next */
    handleDragEnd = () => {
        this.props.onDragEnd();
    };

    render() {
        const pressed = this.props.commandName === this.props.selectedActionName && !this.props.isDraggingCommand;

        const classes = classNames(
            {'command-block--pressed' : pressed},
            {'command-block--dragged' : this.props.isDraggingCommand}
        );

        const ariaLabel: string = this.props.intl.formatMessage({
            id: `Command.${this.props.commandName}`
        });

        return (
            <CommandBlock
                draggable='true'
                id={`command-block--${this.props.commandName}`}
                data-actionpanelgroup={true}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                commandName={this.props.commandName}
                className={classes}
                aria-label={ariaLabel}
                aria-pressed={pressed}
                onClick={this.handleClick}
                disabled={false}>
            </CommandBlock>
        )
    }
}

export default injectIntl(CommandPaletteCommand);
