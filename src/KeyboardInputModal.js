// @flow
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';

import type {KeyDef, KeyboardInputScheme, KeyboardInputSchemeName} from './KeyboardInputSchemes';
import {KeyboardInputSchemes, getLabelMessageKeyFromKeyDef, getIconMessageKeyFromKeyDef} from './KeyboardInputSchemes';

import ToggleSwitch from './ToggleSwitch';

import './KeyboardInputModal.scss';

type KeyboardInputModalProps = {
    intl: IntlShape,
    keyBindingsEnabled: boolean,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    onChangeKeyBindingsEnabled: Function,
    onChangeKeyboardInputScheme: Function,
    onHide: Function,
    show: boolean
};

class KeyboardInputModal extends React.Component<KeyboardInputModalProps, {}> {
    static defaultProps = {
        show: false,
        onChangeKeyBindingsEnabled: () => {},
        onHide: () => {}
    }

    renderKeyBindings = () => {
        // TODO: Make this configurable and store the options in a separate file.
        // This controls which keys are displayed but also determines the order in which they are displayed.
        const keyBindings = [
            "showHide",
            "toggleAnnouncements",
            "addCommandToBeginning",
            "addCommandToEnd",
            "announceScene",
            "playPauseProgram",
            "refreshScene",
            "stopProgram",
            "decreaseProgramSpeed",
            "increaseProgramSpeed"
        ];

        const keyboardInputScheme: KeyboardInputScheme = KeyboardInputSchemes[this.props.keyboardInputSchemeName];

        const keyBindingElements = [];
        keyBindings.forEach((key, index) => {
            const itemKey = "binding-" + index;
            const keyDef: KeyDef = keyboardInputScheme[key];
            const labelKeySegments = [];
            const icons  = [];

            const labelMessageKey = getLabelMessageKeyFromKeyDef(keyDef);
            labelKeySegments.push(this.props.intl.formatMessage({ id: labelMessageKey }));

            const iconMessageKey = getIconMessageKeyFromKeyDef(keyDef);
            const singleKeyString = this.props.intl.formatMessage({ id: iconMessageKey});
            icons.push(<div key="unmodified" className="KeyboardInputModal__binding__icon">
                {singleKeyString}
            </div>);

            // TODO: Discuss removing support for shiftKey flags.
            if (keyDef.shiftKey) {
                const shiftKeyName = this.props.intl.formatMessage(
                    { id: "KeyboardInputModal.KeyLabels.Shift" }
                );
                labelKeySegments.unshift(shiftKeyName);
            }

            if (keyDef.altKey) {
                const altKeyLabel = this.props.intl.formatMessage(
                    { id: "KeyboardInputModal.KeyLabels.Alt" }
                );
                labelKeySegments.unshift(altKeyLabel);

                const altKeyIcon = this.props.intl.formatMessage(
                    { id: "KeyboardInputModal.KeyIcons.Alt" }
                );
                icons.unshift(<div key="alt-modifier" className="KeyboardInputModal__binding__icon">
                    {altKeyIcon}
                </div>);
            }

            if (keyDef.ctrlKey) {
                const controlKeyLabel = this.props.intl.formatMessage(
                    { id: "KeyboardInputModal.KeyLabels.Control" }
                );
                labelKeySegments.unshift(controlKeyLabel);

                const controlKeyIcon = this.props.intl.formatMessage(
                    { id: "KeyboardInputModal.KeyIcons.Control" }
                );
                icons.unshift(<div key="ctrl-modifier" className="KeyboardInputModal__binding__icon">
                    {controlKeyIcon}
                </div>);
            }

            const labelKeyString = labelKeySegments.join(" + ")
            const descriptionMessageKey = "KeyboardInputModal.Description." + key;
            const descriptionMessageId = "key-binding-description-" + index;
            keyBindingElements.push(<li className="KeyboardInputModal__binding" key={itemKey}>
                <div className="KeyboardInputModal__binding__keyCombo"  aria-hidden={true}  aria-labelledby={descriptionMessageId}>
                    {icons}
                </div>
                <div className="KeyboardInputModal__binding__label" id={descriptionMessageId}>
                    <FormattedMessage
                        className="KeyboardInputModal__binding__label" id={descriptionMessageKey}
                        values={{
                            key: labelKeyString
                        }}
                    />
                </div>
            </li>);
        });
        return keyBindingElements;
    }
    renderKeyboardSchemeMenu () {
        const selectOptionElements = [];
        Object.keys(KeyboardInputSchemes).forEach((schemeName) => {
            const messageId = "KeyboardInputModal.Scheme.Descriptions." + schemeName;
            const optionText = this.props.intl.formatMessage({ id: messageId });
            selectOptionElements.push(<option key={schemeName} value={schemeName}>
                {optionText}
            </option>);
        })

        return (<select
            className="KeyboardInputModal__content__schemeDropdown"
            defaultValue={this.props.keyboardInputSchemeName}
            disabled={!this.props.keyBindingsEnabled}
            onChange={this.props.onChangeKeyboardInputScheme}>
            {selectOptionElements}
        </select>);
    }

    render () {
        return(
            <Modal
                onHide={this.props.onHide}
                show={this.props.show}
                aria-modal={true}
                role="dialog"
                dialogClassName='KeyboardInputModal'
            >
                <Modal.Body className='KeyboardInputModal__content'>
                    <h2 className="KeyboardInputModal__content__title">
                        <FormattedMessage id='KeyboardInputModal.Title'/>
                    </h2>

                    <ToggleSwitch
                        ariaLabel={this.props.intl.formatMessage({id: "KeyboardInputModal.Toggle.AriaLabel"})}
                        className="KeyboardInputModal__content__toggle"
                        contentsTrue="On"
                        contentsFalse="Off"
                        value={this.props.keyBindingsEnabled}
                        onChange={this.props.onChangeKeyBindingsEnabled}
                    />

                    {this.renderKeyboardSchemeMenu()}

                    <ul className={"KeyboardInputModal__content__list" + (this.props.keyBindingsEnabled ? "": " KeyboardInputModal__content__list--disabled")}>
                        {this.renderKeyBindings()}
                    </ul>

                    <Button className="KeyboardInputModal__content__closeButton" onClick={this.props.onHide}>
                        <FormattedMessage id="KeyboardInputModal.Done"/>
                    </Button>
                </Modal.Body>
            </Modal>);
    }
}

/*
    ariaLabel: string,
    value: boolean,
    className?: string,
    contentsTrue: any,
    contentsFalse: any,
    onChange: (value: boolean) => void
*/

export default injectIntl(KeyboardInputModal);