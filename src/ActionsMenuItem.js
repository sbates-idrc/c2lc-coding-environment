// @flow
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import classNames from 'classnames';
import {commandBlockIconTypes} from './CommandBlock';

import {ReactComponent as HiddenIcon} from './svg/Hidden.svg'

import './ActionsMenuItem.scss';

type ActionsMenuItemProps = {
    intl: IntlShape,
    isAllowed?: boolean,
    isUsed?: boolean,
    itemKey: string,
    onChange: (event: Event) => void
}

export class ActionsMenuItem extends React.Component< ActionsMenuItemProps, {} > {
    handleKeydown = (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            this.props.onChange(event);
        }
    }

    render () {
        // We don't use FormattedMessage as we are working with a complex chain of templates.
        let commandName = this.props.intl.formatMessage({ id: `ActionsMenuItem.command.${this.props.itemKey}` });
        const usedLabel = this.props.intl.formatMessage({ id: 'ActionsMenuItem.usedItemToggleLabel' });
        if (this.props.isUsed) {
            commandName += " " + usedLabel;
        }

        const commandNameShort = this.props.intl.formatMessage({ id: `Command.short.${this.props.itemKey}` });
        const checkboxId = "actions-menu-item-" + commandNameShort.replace(/ /g, "");

        const actionNameKey = this.props.isAllowed ? "ActionsMenuItem.action.show" : "ActionsMenuItem.action.hide";
        const actionName = this.props.intl.formatMessage({ id: actionNameKey });

        const showHideAriaLabel = this.props.intl.formatMessage(
            { id: "ActionsMenuItem.itemToggleAriaLabel" },
            { action: actionName, commandName: commandName }
        );

        const textClassNames = classNames(
            'ActionsMenuItem__text',
            !this.props.isAllowed && 'ActionsMenuItem__text--disabled'
        );

        const iconClassNames = classNames(
            'ActionsMenuItem__icon',
            'ActionsMenuItem__icon--' + this.props.itemKey,
            !this.props.isAllowed && 'ActionsMenuItem__icon--disabled'
        );

        // $FlowFixMe: Flow is confused about what itemKey is.
        let icon = null;
        const iconType = this.props.isAllowed ? commandBlockIconTypes.get(this.props.itemKey) : HiddenIcon;
        if (iconType) {
            icon = React.createElement(iconType);
        }

        return (
            <div
                className="ActionsMenuItem"
                aria-label={showHideAriaLabel}
                tabIndex={0}
                onKeyDown={this.handleKeydown}
                onClick={this.props.onChange}
            >
                <div className="ActionsMenuItem__option">
                    <input
                        className="ActionsMenuItem__checkbox"
                        type="checkbox"
                        id={checkboxId}
                        checked={this.props.isAllowed}
                        tabIndex={-1}
                    />
                </div>
                <div className={textClassNames}>
                    {commandName}
                </div>
                <div className={iconClassNames}>
                    {icon}
                </div>
            </div>
        );
    };
};

export default injectIntl(ActionsMenuItem);
