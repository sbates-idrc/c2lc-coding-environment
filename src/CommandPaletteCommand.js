// @flow

import React from 'react';
import CommandBlock from './CommandBlock';
import AudioManager from './AudioManager';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type {CommandName} from './types';


type CommandPaletteCommandProps = {
    commandName: CommandName,
    intl: IntlShape,
    selectedCommandName: ?string,
    audioManager: AudioManager,
    onChange: (commandName: ?string) => void,
    onDragStart: (commandName: string) => void,
    onDragEnd: () => void
};

class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        this.props.audioManager.playSound(this.props.commandName);
        this.props.onChange(
            this.props.commandName === this.props.selectedCommandName ? null : this.props.commandName
        );
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
        const pressed = this.props.commandName === this.props.selectedCommandName;

        const ariaLabel: string = this.props.intl.formatMessage({
            id: `CommandPaletteCommand.${this.props.commandName}`
        });

        return (
            <CommandBlock
                draggable='true'
                id={`command-block--${this.props.commandName}`}
                data-actionpanelgroup={true}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                commandName={this.props.commandName}
                className={pressed ? 'command-block--pressed' : undefined}
                aria-label={ariaLabel}
                aria-pressed={pressed}
                onClick={this.handleClick}
                disabled={false}>
            </CommandBlock>
        )
    }
}

export default injectIntl(CommandPaletteCommand);
